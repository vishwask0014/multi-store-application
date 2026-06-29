working of the app

About project:


### user's
1. store owner
2. user


## store owner
- create store and sub store can be created. as there is limit of 1 sub store. {
   storeName:"fruits Mart", // string
   wantSubStore:false, // boolean
   subStore:{
      subStoreName: "Mango House", // string
      _id: "A123" // string 
   }
}

- can create listing/product {
   _id:123, // string
   title:Apple, //string
   stock:2, // number
   price:$123 // number
   region: mohali // string (region will be depend on store location)
   underSubStore:true // boolean
}


## user
- login using phone and set current location in popup.
- can see listing/product/store without login but cant add to cart untill he/she login.
- once login open a popup for the setuping up location on based on that location, show the store.
- add COD Payment method with assign to select delivering partner (another scrope of application).




<!-- screens -->

### Screen

1. Home
   - intro (about app)
   - category ["vegies","Electronics","Celebration","Pharma"]
   - if added by user : fav listing 
   - top store in ur location


2. Products
   - see product by Store and if user have another sub store than a sub store product will show below
   - all store appear with their signature dish.
   - can set location as well. like search or allow app to set to current location by itself

3. cart
   - see added product with store name and if in subsstore than also show that as well also
   - e-recipt and total spending as well

4. profile, payment and order history

<!-- for the "OWNER" -->
5. CRUD screen for Store Owner

6. Manage Store, inventory and Analytics Report

7. 