
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.5.0
 * Query Engine version: 173f8d54f8d52e692c7e27e72a88314ec7aeff60
 */
Prisma.prismaVersion = {
  client: "6.5.0",
  engine: "173f8d54f8d52e692c7e27e72a88314ec7aeff60"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  image: 'image',
  password: 'password',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  businessName: 'businessName',
  businessAddress: 'businessAddress',
  businessPhone: 'businessPhone',
  deliveryAddress: 'deliveryAddress',
  isAvailable: 'isAvailable',
  currentLocation: 'currentLocation',
  vehicleType: 'vehicleType'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.FoodItemScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  originalPrice: 'originalPrice',
  quantity: 'quantity',
  expiryDate: 'expiryDate',
  images: 'images',
  category: 'category',
  status: 'status',
  businessId: 'businessId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  consumerId: 'consumerId',
  businessId: 'businessId',
  courierId: 'courierId',
  totalAmount: 'totalAmount',
  status: 'status',
  deliveryAddress: 'deliveryAddress',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  foodItemId: 'foodItemId',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.UserRole = exports.$Enums.UserRole = {
  UNASSIGNED: 'UNASSIGNED',
  BUSINESS: 'BUSINESS',
  CONSUMER: 'CONSUMER',
  COURIER: 'COURIER',
  ADMIN: 'ADMIN'
};

exports.FoodCategory = exports.$Enums.FoodCategory = {
  MEAT: 'MEAT',
  DAIRY: 'DAIRY',
  PRODUCE: 'PRODUCE',
  BAKERY: 'BAKERY',
  PREPARED: 'PREPARED',
  OTHER: 'OTHER'
};

exports.FoodStatus = exports.$Enums.FoodStatus = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  EXPIRED: 'EXPIRED'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  PICKED_UP: 'PICKED_UP',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

exports.Prisma.ModelName = {
  Account: 'Account',
  User: 'User',
  VerificationToken: 'VerificationToken',
  FoodItem: 'FoodItem',
  Order: 'Order',
  OrderItem: 'OrderItem'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/kwaakuboamah-powers/Documents/food-waste-app/packages/database/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "/Users/kwaakuboamah-powers/Documents/food-waste-app/packages/database/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../.env"
  },
  "relativePath": "../prisma",
  "clientVersion": "6.5.0",
  "engineVersion": "173f8d54f8d52e692c7e27e72a88314ec7aeff60",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// packages/database/prisma/schema.prisma\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  previewFeatures = [\"driverAdapters\"]\n  output          = \"../client\" // generated client goes one level up\n}\n\ndatasource db {\n  provider  = \"postgresql\"\n  url       = env(\"DATABASE_URL\") // ✅ use the working variable from your .env\n  directUrl = env(\"DATABASE_URL\") // ✅ avoid crash due to missing POSTGRES_URL_NON_POOLING\n}\n\nmodel Account {\n  id                String  @id @default(cuid())\n  userId            String\n  type              String\n  provider          String\n  providerAccountId String\n  refresh_token     String? @db.Text\n  access_token      String? @db.Text\n  expires_at        Int?\n  token_type        String?\n  scope             String?\n  id_token          String? @db.Text\n  session_state     String?\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([provider, providerAccountId])\n}\n\nmodel User {\n  id            String    @id @default(cuid())\n  name          String?\n  email         String?   @unique\n  emailVerified DateTime?\n  image         String?\n  password      String?\n  role          UserRole  @default(UNASSIGNED)\n  accounts      Account[]\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  // Business specific fields\n  businessName    String?\n  businessAddress String?\n  businessPhone   String?\n\n  // Consumer specific fields\n  deliveryAddress String?\n\n  // Courier specific fields\n  isAvailable     Boolean @default(false)\n  currentLocation String?\n  vehicleType     String?\n\n  // Relations\n  foodItems      FoodItem[] @relation(\"BusinessFoodItems\")\n  orders         Order[]    @relation(\"ConsumerOrders\")\n  deliveries     Order[]    @relation(\"CourierDeliveries\")\n  businessOrders Order[]    @relation(\"BusinessOrders\")\n}\n\nmodel VerificationToken {\n  identifier String\n  token      String   @unique\n  expires    DateTime\n\n  @@unique([identifier, token])\n}\n\nmodel FoodItem {\n  id            String       @id @default(cuid())\n  name          String\n  description   String\n  price         Float\n  originalPrice Float\n  quantity      Int\n  expiryDate    DateTime\n  images        String[]\n  category      FoodCategory\n  status        FoodStatus   @default(AVAILABLE)\n  businessId    String\n  business      User         @relation(\"BusinessFoodItems\", fields: [businessId], references: [id])\n  createdAt     DateTime     @default(now())\n  updatedAt     DateTime     @updatedAt\n  orderItems    OrderItem[]\n}\n\nmodel Order {\n  id              String      @id @default(cuid())\n  consumerId      String\n  consumer        User        @relation(\"ConsumerOrders\", fields: [consumerId], references: [id])\n  businessId      String\n  business        User        @relation(\"BusinessOrders\", fields: [businessId], references: [id])\n  courierId       String?\n  courier         User?       @relation(\"CourierDeliveries\", fields: [courierId], references: [id])\n  items           OrderItem[]\n  totalAmount     Float\n  status          OrderStatus @default(PENDING)\n  deliveryAddress String\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n}\n\nmodel OrderItem {\n  id         String   @id @default(cuid())\n  orderId    String\n  order      Order    @relation(fields: [orderId], references: [id])\n  foodItemId String\n  foodItem   FoodItem @relation(fields: [foodItemId], references: [id])\n  quantity   Int\n  price      Float\n}\n\nenum UserRole {\n  UNASSIGNED\n  BUSINESS\n  CONSUMER\n  COURIER\n  ADMIN\n}\n\nenum FoodCategory {\n  MEAT\n  DAIRY\n  PRODUCE\n  BAKERY\n  PREPARED\n  OTHER\n}\n\nenum FoodStatus {\n  AVAILABLE\n  RESERVED\n  SOLD\n  EXPIRED\n}\n\nenum OrderStatus {\n  PENDING\n  CONFIRMED\n  PREPARING\n  READY\n  PICKED_UP\n  DELIVERED\n  CANCELLED\n}\n",
  "inlineSchemaHash": "7fcf32ea1545eac8e49cd6089e2b99d67d288e6b5b919bb315d89e40f5209229",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Account\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"provider\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"providerAccountId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"refresh_token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"access_token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expires_at\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"token_type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"scope\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"id_token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"session_state\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AccountToUser\"}],\"dbName\":null},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"emailVerified\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"image\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"UserRole\"},{\"name\":\"accounts\",\"kind\":\"object\",\"type\":\"Account\",\"relationName\":\"AccountToUser\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"businessName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"businessAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"businessPhone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"deliveryAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isAvailable\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"currentLocation\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vehicleType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"foodItems\",\"kind\":\"object\",\"type\":\"FoodItem\",\"relationName\":\"BusinessFoodItems\"},{\"name\":\"orders\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"ConsumerOrders\"},{\"name\":\"deliveries\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"CourierDeliveries\"},{\"name\":\"businessOrders\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"BusinessOrders\"}],\"dbName\":null},\"VerificationToken\":{\"fields\":[{\"name\":\"identifier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expires\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"FoodItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"originalPrice\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"expiryDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"images\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"enum\",\"type\":\"FoodCategory\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"FoodStatus\"},{\"name\":\"businessId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"business\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BusinessFoodItems\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"orderItems\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"FoodItemToOrderItem\"}],\"dbName\":null},\"Order\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"consumerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"consumer\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ConsumerOrders\"},{\"name\":\"businessId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"business\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BusinessOrders\"},{\"name\":\"courierId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"courier\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CourierDeliveries\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"OrderToOrderItem\"},{\"name\":\"totalAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"OrderStatus\"},{\"name\":\"deliveryAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"OrderItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"OrderToOrderItem\"},{\"name\":\"foodItemId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"foodItem\",\"kind\":\"object\",\"type\":\"FoodItem\",\"relationName\":\"FoodItemToOrderItem\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine 
  }
}
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

