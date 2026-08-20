import bcrypt from "bcrypt";
import { db, pool } from "./client.js";
import { ratings, stores, users } from "./schema.js";

async function seed() {
  console.log("Starting database seed...");

  const adminPasswordHash = await bcrypt.hash("Admin@1234", 10);
  const testPasswordHash = await bcrypt.hash("Password@123", 10);

  try {
    console.log("Clearing existing data...");
    await db.delete(ratings);
    await db.delete(stores);
    await db.delete(users);

    const [admin1, admin2] = await db
      .insert(users)
      .values([
        {
          name: "System Administrator Account",
          email: "admin@storerating.com",
          passwordHash: adminPasswordHash,
          address: "Platform Headquarters, MG Road, Bengaluru, Karnataka, India",
          role: "admin",
        },
        {
          name: "Secondary Administrator Account",
          email: "admin2@storerating.com",
          passwordHash: adminPasswordHash,
          address: "Central Office, Residency Road, Bengaluru, Karnataka, India",
          role: "admin",
        },
      ])
      .returning();

    const storeOwners = await db
      .insert(users)
      .values([
        {
          name: "Rahul Sharma Business Owner",
          email: "owner1@storerating.com",
          passwordHash: testPasswordHash,
          address: "Koramangala, Bengaluru, Karnataka, India",
          role: "store_owner",
        },
        {
          name: "Priya Mehta Business Owner",
          email: "owner2@storerating.com",
          passwordHash: testPasswordHash,
          address: "Indiranagar, Bengaluru, Karnataka, India",
          role: "store_owner",
        },
        {
          name: "Arjun Kapoor Business Owner",
          email: "owner3@storerating.com",
          passwordHash: testPasswordHash,
          address: "HSR Layout, Bengaluru, Karnataka, India",
          role: "store_owner",
        },
        {
          name: "Sneha Reddy Business Owner",
          email: "owner4@storerating.com",
          passwordHash: testPasswordHash,
          address: "Whitefield, Bengaluru, Karnataka, India",
          role: "store_owner",
        },
        {
          name: "Vikram Malhotra Business Owner",
          email: "owner5@storerating.com",
          passwordHash: testPasswordHash,
          address: "Jayanagar, Bengaluru, Karnataka, India",
          role: "store_owner",
        },
        {
          name: "Neha Agarwal Business Owner",
          email: "owner6@storerating.com",
          passwordHash: testPasswordHash,
          address: "Malleshwaram, Bengaluru, Karnataka, India",
          role: "store_owner",
        },
      ])
      .returning();

    const normalUsers = await db
      .insert(users)
      .values([
        {
          name: "Aarav Singh Customer Account",
          email: "user1@storerating.com",
          passwordHash: testPasswordHash,
          address: "BTM Layout, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Ananya Gupta Customer Account",
          email: "user2@storerating.com",
          passwordHash: testPasswordHash,
          address: "Malleshwaram, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Rohan Verma Customer Account",
          email: "user3@storerating.com",
          passwordHash: testPasswordHash,
          address: "Marathahalli, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Kavya Nair Customer Account",
          email: "user4@storerating.com",
          passwordHash: testPasswordHash,
          address: "Electronic City, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Aditya Rao Customer Account",
          email: "user5@storerating.com",
          passwordHash: testPasswordHash,
          address: "Rajajinagar, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Meera Iyer Customer Account",
          email: "user6@storerating.com",
          passwordHash: testPasswordHash,
          address: "Banashankari, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Karan Patel Customer Account",
          email: "user7@storerating.com",
          passwordHash: testPasswordHash,
          address: "Hebbal, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Ishita Sharma Customer Account",
          email: "user8@storerating.com",
          passwordHash: testPasswordHash,
          address: "Yelahanka, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Dev Malhotra Customer Account",
          email: "user9@storerating.com",
          passwordHash: testPasswordHash,
          address: "Bellandur, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Riya Kapoor Customer Account",
          email: "user10@storerating.com",
          passwordHash: testPasswordHash,
          address: "JP Nagar, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Nikhil Bansal Customer Account",
          email: "user11@storerating.com",
          passwordHash: testPasswordHash,
          address: "Domlur, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Simran Kaur Customer Account",
          email: "user12@storerating.com",
          passwordHash: testPasswordHash,
          address: "Richmond Town, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Akash Joshi Customer Account",
          email: "user13@storerating.com",
          passwordHash: testPasswordHash,
          address: "Sadashivanagar, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Pooja Menon Customer Account",
          email: "user14@storerating.com",
          passwordHash: testPasswordHash,
          address: "Ulsoor, Bengaluru, Karnataka, India",
          role: "normal",
        },
        {
          name: "Siddharth Bose Customer Account",
          email: "user15@storerating.com",
          passwordHash: testPasswordHash,
          address: "Frazer Town, Bengaluru, Karnataka, India",
          role: "normal",
        },
      ])
      .returning();

    const createdStores = await db
      .insert(stores)
      .values([
        {
          name: "The Daily Grind Coffee House",
          email: "dailygrind@example.com",
          address: "100 Feet Road, Indiranagar, Bengaluru, Karnataka",
          ownerId: storeOwners[0]?.id ?? null,
        },
        {
          name: "Fresh Basket Grocery Market",
          email: "freshbasket@example.com",
          address: "Koramangala 5th Block, Bengaluru, Karnataka",
          ownerId: storeOwners[1]?.id ?? null,
        },
        {
          name: "Urban Threads Fashion Store",
          email: "urbanthreads@example.com",
          address: "Commercial Street, Bengaluru, Karnataka",
          ownerId: storeOwners[2]?.id ?? null,
        },
        {
          name: "Tech Haven Electronics Store",
          email: "techhaven@example.com",
          address: "Brigade Road, Bengaluru, Karnataka",
          ownerId: storeOwners[3]?.id ?? null,
        },
        {
          name: "Green Leaf Organic Market",
          email: "greenleaf@example.com",
          address: "HSR Layout Sector 2, Bengaluru, Karnataka",
          ownerId: storeOwners[4]?.id ?? null,
        },
        {
          name: "Book Corner Reading Store",
          email: "bookcorner@example.com",
          address: "Church Street, Bengaluru, Karnataka",
          ownerId: storeOwners[5]?.id ?? null,
        },
        {
          name: "Home Comfort Furniture Store",
          email: "homecomfort@example.com",
          address: "Bannerghatta Road, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Fitness First Sports Store",
          email: "fitnessfirst@example.com",
          address: "Whitefield Main Road, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Sweet Treats Bakery House",
          email: "sweettreats@example.com",
          address: "Jayanagar 4th Block, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Pet Paradise Supplies Store",
          email: "petparadise@example.com",
          address: "BTM Layout 2nd Stage, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Modern Home Essentials Store",
          email: "modernhome@example.com",
          address: "Malleshwaram 8th Cross, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Creative Canvas Art Studio",
          email: "creativecanvas@example.com",
          address: "MG Road, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Healthy Life Wellness Store",
          email: "healthylife@example.com",
          address: "Electronic City Phase 1, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Smart Choice Mobile Store",
          email: "smartchoice@example.com",
          address: "Marathahalli Bridge Road, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Classic Bites Restaurant Store",
          email: "classicbites@example.com",
          address: "Koramangala 6th Block, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Sunrise Pharmacy Health Store",
          email: "sunrisepharmacy@example.com",
          address: "Basavanagudi, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Little Steps Kids Store",
          email: "littlesteps@example.com",
          address: "Indiranagar 12th Main, Bengaluru, Karnataka",
          ownerId: null,
        },
        {
          name: "Quiet Corner Stationery Store",
          email: "quietcorner@example.com",
          address: "Richmond Road, Bengaluru, Karnataka",
          ownerId: null,
        },
      ])
      .returning();

    const ratingsData: {
      userId: string;
      storeId: string;
      rating: number;
    }[] = [];

    for (const [storeIndex, store] of createdStores.entries()) {
      if (storeIndex === createdStores.length - 1) {
        continue;
      }

      for (const [userIndex, user] of normalUsers.entries()) {
        // Not every user will rate every store.
        // To create a more realistic dataset, we will skip some ratings based on the store and user index.
        if ((storeIndex + userIndex) % 3 === 0) {
          continue;
        }

        const rating = ((storeIndex * 2 + userIndex) % 5) + 1;

        ratingsData.push({
          userId: user.id,
          storeId: store.id,
          rating,
        });
      }
    }

    if (ratingsData.length > 0) {
      await db.insert(ratings).values(ratingsData);
    }

    console.log("Database seed completed successfully.");
    console.log("");
    console.log("Created:");
    console.log(`- 2 admins`);
    console.log(`- ${storeOwners.length} store owners`);
    console.log(`- ${normalUsers.length} normal users`);
    console.log(`- ${createdStores.length} stores`);
    console.log(`- ${ratingsData.length} ratings`);

    console.log("");
    console.log("Test accounts:");
    console.log("");

    console.log("Admin:");
    console.log("Email: admin@storerating.com");
    console.log("Password: Admin@1234");

    console.log("");

    console.log("Store Owner:");
    console.log("Email: owner1@storerating.com");
    console.log("Password: Password@123");

    console.log("");

    console.log("Normal User:");
    console.log("Email: user1@storerating.com");
    console.log("Password: Password@123");

    console.log("");

    console.log("Second Normal User:");
    console.log("Email: user2@storerating.com");
    console.log("Password: Password@123");

    console.log("");

    console.log("Seed finished.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
