import { connectDB } from "./src/config/mongodb_connection.js";
import Product from "./src/models/product.model.js";

await connectDB();
const products = await Product.find().limit(3).select("name slug images");
console.log(JSON.stringify(products, null, 2));
process.exit(0);
