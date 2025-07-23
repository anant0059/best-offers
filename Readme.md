## Folder Structure

```
app/
  Controllers/       # define request handlers and route logic
  Initializers/      # set up database connections and services
  Middlewares/       # express middleware (e.g., error handling)
  Models/            # mongoose schema definitions
  Repository/        # data access layer (DB queries and upserts)
  Services/          # business logic and computations
  Utils/             # shared utilities (e.g., logging)
  Validators/        # input validation schemas
config/             # application configuration files
logs/               # application log files
node_modules/       # npm dependencies
routes/             # API route definitions
.env                # environment variables template
app.js              # application entrypoint
offer_response1_curl.txt  # sample Flipkart curl request/response
offer_response1.json      # extracted sample payload
package.json        # npm manifest (scripts and dependencies)
package-lock.json   # lockfile for npm
Readme.md           # this documentation
```

---

## 1. Setup Instructions

a. **Clone the repository**

   ```bash
   git clone https://github.com/anant0059/best-offers.git
   cd best-offers
   ```

b. **Install dependencies** (package.json included)

   ```bash
   npm install
   ```

c. **Start MongoDB**

   * Using Docker:

     ```bash
     docker run -d \
       --name bestoffer-db \
       -p 27017:27017 \
       -e MONGO_INITDB_DATABASE=bestoffer \
       mongo:latest
     ```
   * Connection string: `mongodb://localhost:27017/bestoffer`

4. **Configure environment**

   * Copy `.env.example` to `.env`
   * Set `MONGODB_URI=mongodb://localhost:27017/bestoffer`
   * (Optional) adjust `PORT` or other variables

5. **Run the server**

   ```bash
   npm start
   ```

6. **Test the endpoints**
   You can use the following `curl` commands:

   ```bash
   # Upsert an offer (raw Flipkart response)
   curl --location 'http://localhost:3000/bestoffer/api/offers/v1/offer' \
     --header 'Content-Type: application/json' \
     --data '{
       "flipkartOfferApiResponse": {
         "offers": {
           "headerTitle": "Offers on online payment",
           "offerList": [
             {
               "provider": ["ICICI"],
               "logo": "/path/to/ICICI.svg",
               "offerText": { "text": "Save ₹10,000" },
               "offerDescription": {
                 "type": "tenure.detail.offer.terms.conditions",
                 "id": "FPO250701194857KFHIY",
                 "text": "Extra ₹10000 Off On selected Bank TRNX"
               }
             }
           ]
         }
       }
     }'

   # Get the best offer for HDFC on ₹50,000
   curl --location 'http://localhost:3000/bestoffer/api/offers/v1/highest-discount?bankName=HDFC&amountToPay=50000' \
     --header 'Accept: application/json'
   ```

---

## 2. Assumptions

* No dedicated public Flipkart discount API was available; instead, request/response from a relevent curl request form flipkart web is saved as `offer_response1_curl.txt` and the data related to offer is extracted from response data of a request is stored as JSON payload is in `offer_response1.json`.
* We assume a single `provider` per offer and grab the first element from the provider array.
* The DB name is fixed as `bestoffer` per assignment.

---

## 3. Design Choices

* **Framework**: Chose Node.js with Express for rapid development and familiarity. Easily supports middleware, routing, and JSON handling.
* **Database**: MongoDB for its schema flexibility and JSON-native storage, since Flipkart payloads may change shape over time.
* **Schema**: Stores only the normalized fields (`offerId`, `providers`, `discountType`, etc.) plus `rawPayload` for traceability. Index on `providers` only to speed eligibility queries. The source code is self‑explanatory and includes inline comments for clarity. Index on `providers` to speed eligibility queries.
* **Upsert logic**: Uses Flipkart’s internal `id` as a unique key to prevent overwriting distinct offers that share the same human-readable `offerId`.

---

## 4. Scaling GET /highest-discount to 1,000 RPS

* **Indexing**: Indexed `providers` only to limit scanned documents for `findEligible`.
* **Caching**: Introduce Redis to cache popular query results (e.g. same bankName+amount ranges) with a short TTL.
* **Connection Pooling**: Ensuring MongoDB driver uses a pool of connections to avoid cold starts
* **Horizontal Scaling**: Deploy multiple stateless Node.js instances behind a load balancer.
* **Monitoring**: Use APM and rate-limiting to prevent abuse and to monitor latency at scale.

---

## 5. Future Improvements 

* **Payment Instrument Support**: Add `instruments` field (CreditCard, UPI, EMI, etc.) to filter offers by payment type.
* **Data Enrichment**: Scrape additional Flipkart pages to capture more edge-case promo formats.
* **Bonus Features**: UI dashboard to visualize top offers per bank and per user tier.
* **Testing**: Add unit tests and integration tests (Jest + Supertest) for full coverage.
