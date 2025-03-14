import type { Tables, TablesInsert, TablesUpdate } from "./supabase_types";

// JSON doesn't support object types, so fields are converted to Date objects in the app.
// Where interal type doesn't match DB exactly, there is a *DB type as well for insert/update.
// Note: using same named date fields across multiple tables
// Assumes start_date is always present, end_date is optional across all tables
type DateFields = "start_date" | "end_date";
type WithDateFields<T> = Omit<T, DateFields> & {
  start_date: Date;
  end_date?: Date;
};

export type Family = Tables<"families">;
export type Families = Array<{
  id: Family["id"];
  name: Family["name"];
  member_type: FamilyUsers["member_type"];
}>;
export type FamilyInsert = TablesInsert<"families">;
export type FamilyUpdate = TablesUpdate<"families">;

export type FamilyUsers = Tables<"family_users">;
export type FamilyUsersInsert = TablesInsert<"family_users">;
export type FamilyUsersUpdate = TablesUpdate<"family_users">;

export type LocationDB = Tables<"locations">;
export type Location = WithDateFields<LocationDB>;
export type LocationInsert = WithDateFields<TablesInsert<"locations">>;
export type LocationUpdate = WithDateFields<TablesUpdate<"locations">>;

export type MomentDB = Omit<
  Tables<"moments">,
  "photos" | "pets" | "locations"
> & {
  photos: Photo[];
  pets: Pet[];
  locations: Location[];
};

export type Moment = WithDateFields<MomentDB>;
export type MomentInsert = WithDateFields<TablesInsert<"moments">>;
export type MomentUpdate = WithDateFields<TablesUpdate<"moments">>;

export type PetDB = Tables<"pets">;
export type Pet = WithDateFields<PetDB>;
export type PetInsert = WithDateFields<TablesInsert<"pets">>;
export type PetUpdate = WithDateFields<TablesUpdate<"pets">>;

export type UserDB = Tables<"users">;
export type User = UserDB;
export type UserInsert = TablesInsert<"users">;
export type UserUpdate = TablesUpdate<"users">;

export type FamilyDataDB = {
  pets: PetDB[];
  locations: LocationDB[];
  users: UserDB[];
  moments: MomentDB[];
};

export type FamilyData = {
  pets: Pet[];
  locations: Location[];
  users: User[];
  moments: Moment[];
  overlappingPetsForLocations: Record<number, Pet[]>; // locationId -> overlapping pets
  overlappingLocationsForPets: Record<number, Location[]>; // petId -> overlapping locations
  overlappingPetsForPets: Record<number, Pet[]>; // petId -> overlapping pets
  overlappingLocationsForLocations: Record<number, Location[]>; // locationId -> overlapping locations
};

// For photos specifically
export type Photo = {
  id: string; 
  name: string; // :familyId/:momentId/filename.ext
  bucket_id: string; // "photos"
  owner: string; // user_id
  mimeType: string;
  created_at: Date;
  updated_at: Date;
  last_accessed_at: Date;
};
