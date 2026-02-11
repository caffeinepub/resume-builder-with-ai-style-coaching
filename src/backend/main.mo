import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Text "mo:core/Text";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SectionType = { #summary; #experience; #education; #skills };
  type SuggestionCategory = { #impact; #clarity; #keywords; #formatting };

  public type Resume = {
    id : Nat;
    title : Text;
    sections : [(SectionType, Text)];
  };

  public type Suggestion = {
    section : SectionType;
    category : SuggestionCategory;
    message : Text;
  };

  public type CoachingResult = {
    timestamp : Time.Time;
    suggestions : [Suggestion];
  };

  public type ResumeWithCoaching = {
    resume : Resume;
    coaching : ?CoachingResult;
  };

  public type UserProfile = {
    name : Text;
  };

  module Resume {
    public func compareByTitle(a : Resume, b : Resume) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  let resumes = Map.empty<Principal, Map.Map<Nat, Resume>>();
  let coachingResults = Map.empty<Principal, Map.Map<Nat, CoachingResult>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 1;

  func getResumeMap(caller : Principal) : Map.Map<Nat, Resume> {
    switch (resumes.get(caller)) {
      case (?userMap) { userMap };
      case (null) {
        let newUserMap = Map.empty<Nat, Resume>();
        resumes.add(caller, newUserMap);
        newUserMap;
      };
    };
  };

  func getCoachingMap(caller : Principal) : Map.Map<Nat, CoachingResult> {
    switch (coachingResults.get(caller)) {
      case (?userMap) { userMap };
      case (null) {
        let newUserMap = Map.empty<Nat, CoachingResult>();
        coachingResults.add(caller, newUserMap);
        newUserMap;
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type UpdateSection = (SectionType, Text);

  public shared ({ caller }) func createResume(title : Text, sections : [UpdateSection]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create resumes");
    };
    let resume : Resume = {
      id = nextId;
      title;
      sections;
    };
    let userResumes = getResumeMap(caller);
    userResumes.add(nextId, resume);
    nextId += 1;
    resume.id;
  };

  public query ({ caller }) func getResume(id : Nat) : async Resume {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resumes");
    };
    let userResumes = getResumeMap(caller);
    switch (userResumes.get(id)) {
      case (?resume) { resume };
      case (null) { Runtime.trap("Resume not found") };
    };
  };

  public shared ({ caller }) func updateResume(
    id : Nat,
    title : Text,
    sections : [UpdateSection],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update resumes");
    };
    let userResumes = getResumeMap(caller);
    switch (userResumes.get(id)) {
      case (?_) {
        let updatedResume : Resume = {
          id;
          title;
          sections;
        };
        userResumes.add(id, updatedResume);
      };
      case (null) { Runtime.trap("Resume not found") };
    };
  };

  public shared ({ caller }) func deleteResume(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete resumes");
    };
    let userResumes = getResumeMap(caller);
    switch (userResumes.get(id)) {
      case (?_) {
        userResumes.remove(id);
        let userCoaching = getCoachingMap(caller);
        userCoaching.remove(id);
      };
      case (null) { Runtime.trap("Resume not found") };
    };
  };

  public query ({ caller }) func getAllResumes() : async [Resume] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resumes");
    };
    let userResumes = getResumeMap(caller);
    userResumes.values().toArray().sort(Resume.compareByTitle);
  };

  func analyzeSection(section : SectionType, content : Text) : [Suggestion] {
    let suggestions = List.empty<Suggestion>();
    switch (section) {
      case (#summary) {
        if (content.size() < 50) {
          suggestions.add({
            section;
            category = #impact;
            message = "Summary is too short. Aim for at least 50 characters.";
          });
        };
        if (not content.contains(#text "motivated")) {
          suggestions.add({
            section;
            category = #keywords;
            message = "Consider adding the keyword 'motivated'.";
          });
        };
      };
      case (#experience) {
        if (not content.contains(#text "achieved")) {
          suggestions.add({
            section;
            category = #impact;
            message = "Use action verbs like 'achieved' for better impact.";
          });
        };
      };
      case (#education) {
        if (not content.contains(#text "degree")) {
          suggestions.add({
            section;
            category = #clarity;
            message = "Specify your degree clearly (e.g., 'Bachelor of Science').";
          });
        };
      };
      case (#skills) {
        if (content.split(#char ',').toArray().size() < 5) {
          suggestions.add({
            section;
            category = #clarity;
            message = "List at least 5 skills separated by commas.";
          });
        };
      };
    };
    suggestions.toArray();
  };

  public shared ({ caller }) func runCoaching(resumeId : Nat) : async CoachingResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can run coaching");
    };
    let userResumes = getResumeMap(caller);
    switch (userResumes.get(resumeId)) {
      case (?resume) {
        let allSuggestions = List.empty<Suggestion>();
        for ((sectionType, content) in resume.sections.values()) {
          let sectionSuggestions = analyzeSection(sectionType, content);
          allSuggestions.addAll(sectionSuggestions.values());
        };
        let result : CoachingResult = {
          timestamp = Time.now();
          suggestions = allSuggestions.toArray();
        };
        let userCoaching = getCoachingMap(caller);
        userCoaching.add(resumeId, result);
        result;
      };
      case (null) { Runtime.trap("Resume not found") };
    };
  };

  public query ({ caller }) func getCoachingResult(resumeId : Nat) : async ?CoachingResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view coaching results");
    };
    let userCoaching = getCoachingMap(caller);
    userCoaching.get(resumeId);
  };

  public query ({ caller }) func getResumeWithCoaching(resumeId : Nat) : async ResumeWithCoaching {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resume data");
    };
    let userResumes = getResumeMap(caller);
    switch (userResumes.get(resumeId)) {
      case (?resume) {
        let userCoaching = getCoachingMap(caller);
        {
          resume;
          coaching = userCoaching.get(resumeId);
        };
      };
      case (null) { Runtime.trap("Resume not found") };
    };
  };
};
