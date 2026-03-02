CREATE TABLE IF NOT EXISTS "Customer" (
	"id_customer" SERIAL NOT NULL UNIQUE,
	"customer_name" VARCHAR(255) NOT NULL,
	"customer_email" VARCHAR(255) NOT NULL,
	"customer_address" VARCHAR(255) NOT NULL,
	"customer_phone" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id_customer")
);




CREATE TABLE IF NOT EXISTS "Product" (
	"id_product" SERIAL NOT NULL UNIQUE,
	"product_sku" VARCHAR(255) NOT NULL,
	"product_name" VARCHAR(255) NOT NULL,
	"unit_price" DECIMAL NOT NULL,
	"id_pcategory" INTEGER NOT NULL,
	PRIMARY KEY("id_product")
);




CREATE TABLE IF NOT EXISTS "Suppliers" (
	"id_supplier" SERIAL NOT NULL UNIQUE,
	"supplier_name" VARCHAR(255) NOT NULL,
	"supplier_email" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id_supplier")
);




CREATE TABLE IF NOT EXISTS "Transaction" (
	"id_transaction" SERIAL NOT NULL UNIQUE,
	"id_orders" INTEGER NOT NULL,
	"id_customer" INTEGER NOT NULL,
	"id_supplier" INTEGER NOT NULL,
	"id_product" INTEGER NOT NULL,
	"quantity" NUMERIC NOT NULL,
	"total_line_value" DECIMAL NOT NULL,
	PRIMARY KEY("id_transaction")
);




CREATE TABLE IF NOT EXISTS "product_categories" (
	"id_pcategory" SERIAL NOT NULL UNIQUE,
	"category_name" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id_pcategory")
);




CREATE TABLE IF NOT EXISTS "orders" (
	"id_orders" SERIAL NOT NULL,
	"orders_date" DATE NOT NULL,
	PRIMARY KEY("id_orders")
);



ALTER TABLE "Customer"
ADD FOREIGN KEY("id_customer") REFERENCES "Transaction"("id_customer")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Transaction"
ADD FOREIGN KEY("id_transaction") REFERENCES "Product"("id_product")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Suppliers"
ADD FOREIGN KEY("id_supplier") REFERENCES "Transaction"("id_supplier")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "product_categories"
ADD FOREIGN KEY("id_pcategory") REFERENCES "Product"("id_pcategory")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "orders"
ADD FOREIGN KEY("id_orders") REFERENCES "Transaction"("id_orders")
ON UPDATE NO ACTION ON DELETE NO ACTION;