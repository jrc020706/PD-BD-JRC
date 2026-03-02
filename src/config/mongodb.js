import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * Esquema de un Ítem de Pedido (Detalle del Producto)
 * Representa los productos comprados en una transacción específica.
 */
const orderItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true }, // ID de SQL
  sku: { type: String, required: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalLineValue: { type: Number, required: true }
}, { _id: false });

/**
 * Esquema de Pedido (Order)
 * Se guarda dentro del historial del cliente (Modelo Embebido)
 */
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true }, // ID primario de SQL
  orderDate: { type: Date, required: true },
  items: [orderItemSchema], // Lista de productos comprados
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String },
  status: { type: String, default: "completed" }
}, { _id: false });

/**
 * Esquema de Historial del Cliente (CustomerHistory)
 * Centraliza toda la actividad de compra de un usuario.
 */
const customerHistorySchema = new mongoose.Schema({
  customerId: { type: Number, required: true }, // Referencia al SERIAL de SQL
  customerName: { type: String, required: true },
  customerEmail: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido'] 
  },
  customerPhone: { type: String },
  customerAddress: { type: String },
  // Historial de todos los pedidos realizados
  purchaseHistory: {
    type: [orderSchema],
    default: []
  }
}, { 
  timestamps: true,
  versionKey: false 
});

// Índice para búsquedas rápidas por email del cliente
customerHistorySchema.index({ customerEmail: 1 });

export const CustomerHistory = mongoose.model("CustomerHistory", customerHistorySchema);

/**
 * Conexión a MongoDB
 */
export async function connectMongo() {
    try {
        if (mongoose.connection.readyState === 1) return;

        // Se recomienda revisar la [Guía de Conexión de Mongoose](https://mongoosejs.com) para producción
        await mongoose.connect(env.databaseMongoUrl);
        
        console.log("✅ MongoDB: Conexión establecida para Historial de E-commerce.");
    } catch (error) {
        console.error("❌ MongoDB: Error de conexión:", error.message);
        throw error; 
    }
}

