import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import MixinStorage "blob-storage/Mixin";
import Authority "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";

actor {
  let accessControlState = Authority.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  module ProductInternal {
    public func compare(a : ProductInternal, b : ProductInternal) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type ProductInternal = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    imageId : Storage.ExternalBlob;
    stock : Nat;
    isActive : Bool;
    createdAt : Int;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    imageId : ?Storage.ExternalBlob;
    stock : Nat;
    isActive : Bool;
    createdAt : Int;
  };

  public type Inquiry = {
    name : Text;
    email : Text;
    productId : Text;
    message : Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  let productStorage = Map.empty<Text, ProductInternal>();
  let inquiryStorage = Map.empty<Nat, Inquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextInquiryId = 0;

  func toProduct(productInternal : ProductInternal) : Product {
    { productInternal with imageId = ?productInternal.imageId };
  };

  // Helper function to check admin privileges
  func mustBeAdmin(caller : Principal, accessControlState : Authority.AccessControlState) {
    if (not (Authority.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // -- User Profile Management --

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (Authority.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not Authority.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (Authority.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // -- Public Product Queries --

  public query ({ caller }) func getAllActiveProducts() : async [Product] {
    productStorage.values().toArray().filter(
      func(p) { p.isActive }
    ).map(
      func(p) { toProduct(p) }
    );
  };

  public query ({ caller }) func getProductById(productId : Text) : async ?Product {
    switch (productStorage.get(productId)) {
      case (null) { null };
      case (?product) { ?toProduct(product) };
    };
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    productStorage.values().toArray().filter(
      func(p) { p.category == category and p.isActive }
    ).map(
      func(p) { toProduct(p) }
    );
  };

  // -- Admin Product Management --

  public shared ({ caller }) func addProduct(
    id : Text,
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    imageId : Storage.ExternalBlob,
    stock : Nat
  ) : async () {
    mustBeAdmin(caller, accessControlState);
    let newProduct : ProductInternal = {
      id;
      name;
      description;
      price;
      category;
      imageId;
      stock;
      isActive = true;
      createdAt = Time.now();
    };
    productStorage.add(id, newProduct);
  };

  public shared ({ caller }) func updateProduct(
    id : Text,
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    imageId : Storage.ExternalBlob,
    stock : Nat
  ) : async () {
    mustBeAdmin(caller, accessControlState);
    switch (productStorage.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let updatedProduct : ProductInternal = {
          id;
          name;
          description;
          price;
          category;
          imageId;
          stock;
          isActive = existingProduct.isActive;
          createdAt = existingProduct.createdAt;
        };
        productStorage.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func toggleProductActive(id : Text) : async () {
    mustBeAdmin(caller, accessControlState);
    switch (productStorage.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let toggledProduct : ProductInternal = {
          product with isActive = not product.isActive;
        };
        productStorage.add(id, toggledProduct);
      };
    };
  };

  // -- Inquiry System --

  public shared ({ caller }) func submitInquiry(name : Text, email : Text, productId : Text, message : Text) : async () {
    let inquiry : Inquiry = {
      name;
      email;
      productId;
      message;
      timestamp = Time.now();
    };
    inquiryStorage.add(nextInquiryId, inquiry);
    nextInquiryId += 1;
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (Authority.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    inquiryStorage.values().toArray();
  };
};
