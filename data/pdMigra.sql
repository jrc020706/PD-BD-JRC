CREATE TABLE IF NOT EXISTS "customer" (
	"id_customer" SERIAL NOT NULL UNIQUE,
	"customer_name" VARCHAR(255) NOT NULL,
	"customer_email" VARCHAR(255) NOT NULL UNIQUE,
	"customer_address" VARCHAR(255) NOT NULL,
	"customer_phone" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id_customer")
);




CREATE TABLE IF NOT EXISTS product (
	"id_product" SERIAL NOT NULL UNIQUE,
	"product_sku" VARCHAR(255) NOT NULL UNIQUE,
	"product_name" VARCHAR(255) NOT NULL,
	"unit_price" DECIMAL NOT NULL,
	"id_pcategory" INTEGER NOT NULL,
	PRIMARY KEY("id_product")
);




CREATE TABLE IF NOT EXISTS suppliers (
	"id_supplier" SERIAL NOT NULL UNIQUE,
	"supplier_name" VARCHAR(255) NOT NULL,
	"supplier_email" VARCHAR(255) NOT NULL UNIQUE,
	PRIMARY KEY("id_supplier")
);




CREATE TABLE IF NOT EXISTS transactions (
	"id_transactions" SERIAL PRIMARY KEY,
	"id_orders" INTEGER NOT NULL,
	"id_customer" INTEGER NOT NULL,
	"id_supplier" INTEGER NOT NULL,
	"id_product" INTEGER NOT NULL,
	"quantity" NUMERIC NOT NULL,
	"total_line_value" DECIMAL NOT NULL,
	PRIMARY KEY("id_transactions")

);




CREATE TABLE IF NOT EXISTS product_categories (
	"id_pcategory" SERIAL PRIMARY KEY,
	"category_name" VARCHAR(255) NOT NULL UNIQUE,
	PRIMARY KEY("id_pcategory")
);




CREATE TABLE IF NOT EXISTS orders (
	"id_orders" SERIAL PRIMARY KEY,
	"orders_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id_orders")
);



ALTER TABLE customer
ADD FOREIGN KEY("id_customer") REFERENCES "transactions"("id_customer")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE transactions
ADD FOREIGN KEY("id_transactions") REFERENCES "product"("id_product")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE suppliers
ADD FOREIGN KEY("id_supplier") REFERENCES "transactions"("id_supplier")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE product_categories
ADD FOREIGN KEY("id_pcategory") REFERENCES "product"("id_pcategory")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE orders
ADD FOREIGN KEY("id_orders") REFERENCES "transactions"("id_orders")
ON UPDATE NO ACTION ON DELETE NO ACTION;