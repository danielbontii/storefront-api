# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
### Product Routes
'/products'  [GET] 

'/products/:id' [GET] 

'/products' [POST] 

'/products/categories/:category' [GET]

### User routes
'/users'  [GET] 

'/users/:id'  [GET]

'/users'  [POST]

### Orders routes
'/orders'  [POST] 

'/orders/complete-order'  [POST]

'/orders/:userId/complete'  [GET]

'/orders/:userId/active'  [GET]

### Category routes
'/categories' [GET] 

'/categories' [POST] 

### Auth routes
'/auth/?password' [GET]

## Data Shapes
#### Product
- id [UUID]
- product_name [VARCHAR]
- price [NUMERIC]
- category_id [INTEGER]

#### User
- id [UUID]
- first_name [VARCHAR]
- last_name [VARCHAR]
- password_digest [VARCHAR]

#### Category
- id [INTEGER]
- category_name [VARCHAR]

#### Orders
- id [UUID]
- user_id [UUID]
- status [VARCHAR]
- created_at [TIMESTAMP]
- completed_at [TIMESTAMP]

### Orders_Products
- id [UUID]
- product_id [UUID]
- order_id [UUID]
- quantity [INTEGER]
