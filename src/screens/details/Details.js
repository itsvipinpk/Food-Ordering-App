import React, { Component } from 'react';

//importing Header
import Header from '../../common/header/Header';

//importing the css file of the Details page
import './Details.css';

import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core";

import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Card from "@material-ui/core/Card";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Fade from "@material-ui/core/Fade";


// Custom Styles 
const styles = (theme) => ({

    
    textRatingCost: {
        //Style for the Text of the Rating and cost.
        "text-overflow": "clip",
        width: "145px",
        color: "grey",
    },
    restaurantName: {
        //Style for the Restaurant name.
        padding: "8px 0px 8px 0px",
        "font-size": "30px",
    },
    restaurantCategory: {
        //Style for the Restaurant Category.
        padding: "8px 0px 8px 0px",
    },
    avgCost: {
        //Style for the Average cost.
        "padding-left": "5px",
    },
    itemPrice: {
        //Style for the Item prices.
        "padding-left": "5px",
    },
    addButton: {
        //Style for the add Button.
        "margin-left": "25px",
    },
    menuItemName: {
        //Style for the Item menu name.
        "margin-left": "20px",
    },
    shoppingCart: {
        //Style for the Shopping cart.
        color: "black",
        "background-color": "white",
        width: "60px",
        height: "50px",
        "margin-left": "-20px",
    },
    cartHeader: {
        //Style for the Cart Header containing the icon and title.
        "padding-bottom": "0px",
        "margin-left": "10px",
        "margin-right": "10px",
    },
    cartItemButton: {
        //Style for the button in the cart.
        padding: "10px",
        "border-radius": "0",
        color: "#fdd835",
        "&:hover": {
            "background-color": "#ffee58",
        },
    },
    cardContent: {
        //Style for the content for card.
        "padding-top": "0px",
        "margin-left": "10px",
        "margin-right": "10px",
    },
    totalAmount: {
        //Style for the the total amount.
        "font-weight": "bold",
    },
    checkOutButton: {
        //Style for the Checkout button in the cart card.
        "font-weight": "400",
    },

});

class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurantDetails: [],
            categories: [],
            cartItems: [],
            totalAmount: 0,
            snackBarOpen: false,
            snackBarMessage: "",
            transition: Fade,
            badgeVisible: false,
        }
    }

    componentDidMount() {
        let data = null;
        let that = this;
        let xhrRestaurantDetails = new XMLHttpRequest();

        xhrRestaurantDetails.addEventListener("readystatechange", function () {
            if (
                xhrRestaurantDetails.readyState === 4 &&
                xhrRestaurantDetails.status === 200
            ) {
                let response = JSON.parse(xhrRestaurantDetails.responseText);

                let categoriesList = [];

                response.categories.forEach((category) => {
                    categoriesList.push(category.category_name);
                });

                let restaurantDetails = {
                    id: response.id,
                    name: response.restaurant_name,
                    photoURL: response.photo_URL,
                    avgCost: response.average_price,
                    rating: response.customer_rating,
                    noOfCustomerRated: response.number_customers_rated,
                    locality: response.address.locality,
                    categoriesName: categoriesList.toString
                };


                let categories = response.categories;
                that.setState({
                    ...this.state,
                    restaurantDetails: restaurantDetails,
                    categories: categories,
                });
              
            }
        })
        xhrRestaurantDetails.open("GET", this.props.baseUrl + "restaurant/" + this.props.match.params.id);
        xhrRestaurantDetails.send(data);
    }

    //This Method handles the add item  in the menu list functionaity .
    //if the item is not present in the cart , it adds the item to the cart array in the state 
    //if the item is already present then only increases the quantity of the item.
    //This method takes the item as the parameter.
    //After each update a corressponding snackbar message displayed

    itemAddButtonClickHandler = (item) => {

        let cartItems = this.state.cartItems;
        let itemPresentInCart = false;

        //iterating over all the items in the cart  to check if the item in the parameter is already present in the cart.
        cartItems.forEach((cartItem) => {

            //  if the parameter item.id matches with the id of item i in the cart.
            // if true then increasing only the quantity and update the price
            if (cartItem.id === item.id) {

                itemPresentInCart = true;
                cartItem.quantity++;
                cartItem.totalAmount = cartItem.price * cartItem.quantity;
            }
        });


        // if the item is not present in the cart  then new item is created and added to the cart.
        if (!itemPresentInCart) {

            let cartItem = {
                id: item.id,
                name: item.item_name,
                price: item.price,
                totalAmount: item.price,
                quantity: 1,
                itemType: item.item_type,
            };
            cartItems.push(cartItem);
        }

        //updating the total amount for the cart.
        let totalAmount = 0;
        cartItems.forEach((cartItem) => {
            totalAmount = totalAmount + cartItem.totalAmount;
        });

        //Updating the state.
        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: "Item added to cart!",
            totalAmount: totalAmount,
        });
    };

    //This method is called when the minus icon is clicked in the cart.
    //takes item as a parameter.
    //if  the quantity of item  is more than 1 it decease the quantity by 1
    //if the quantity of item is 1 it removes the item from cart 
    //After each update a corressponding snackbar message is displayed.
    cartMinusButtonClickHandler = (item) => {

        let cartItems = this.state.cartItems;
        let index = cartItems.indexOf(item);
        let itemRemoved = false;
        cartItems[index].quantity--;
        if (cartItems[index].quantity === 0) {
            cartItems.splice(index, 1);
            itemRemoved = true;
        }
        else {
            cartItems[index].totalAmount =
                cartItems[index].price * cartItems[index].quantity;
        }

        let totalAmount = 0;
        cartItems.forEach((cartItem) => {
            totalAmount = totalAmount + cartItem.totalAmount;
        });

        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: itemRemoved
                ? "Item removed from cart!"
                : "Item quantity decreased by 1!",
            totalAmount: totalAmount,
        });

    };

    //This method is called when the add icon is clicked in the cart.
    //takes item as a parameter.
    //increase the quantity of item  by 1 
    //After each update a corressponding snackbar message is displayed.
    cartAddButtonClickHandler = (item) => {

        let cartItems = this.state.cartItems;
        let index = cartItems.indexOf(item);
        cartItems[index].quantity++;
        cartItems[index].totalAmount =
            cartItems[index].price * cartItems[index].quantity;


        let totalAmount = 0;
        cartItems.forEach((cartItem) => {
            totalAmount = totalAmount + cartItem.totalAmount;
        });


        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: "Item quantity increased by 1!",
            totalAmount: totalAmount,
        });

    };

    //Handles Close function of the snackBar
    snackBarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        this.setState({
            ...this.state,
            snackBarMessage: "",
            snackBarOpen: false,
        });
    };
   
    //to hide the badge when the modal is opened
    changeBadgeVisibility = () => {

        let visible=this.state.badgeVisible;           
        this.setState({
          ...this.state,
          badgeVisible: !visible,
        });
      };

    
    render() {

        const { classes } = this.props;

        return (
            <div>
                <Header
                    history={this.props.history}
                    baseUrl={this.props.baseUrl}
                    showHeaderSearchBox={false}
                    changeBadgeVisibility={this.changeBadgeVisibility}   // when modal is opened -> hide the badge of shopping cart
                />

                <div className="restaurant-details-section">
                    <div>
                        <img
                            src={this.state.restaurantDetails.photoURL}
                            alt="Restaurant"
                            height="215px"
                            width="275px"
                        />
                    </div>
                    <div className="restaurant-details">

                        <div className="restaurant-name">

                            <Typography
                                variant="h5"
                                component="h5"
                            >
                                {this.state.restaurantDetails.name}
                            </Typography>

                        </div>
                        <Typography
                            variant="subtitle1"
                            component="p"

                        >
                            {this.state.restaurantDetails.locality}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            component="p"

                        >
                            {this.state.restaurantDetails.categoriesName}
                        </Typography>
                        <div className="restaurant-rating-cost-section">

                            <div className="restaurant-rating-section">

                                <div className="restaurant-rating">
                                    <i className="fa fa-star"></i>

                                    <Typography variant="subtitle1" component="p">
                                        {this.state.restaurantDetails.rating}
                                    </Typography>

                                </div>

                                <Typography
                                    variant="caption"
                                    component="p"

                                >
                                    AVERAGE RATING BY{" "}
                                    {
                                        <span className="restaurant-NoOfCustomerRated">
                                            {this.state.restaurantDetails.noOfCustomerRated}
                                        </span>
                                    }{" "}
                                      CUSTOMERS
                                     </Typography>
                            </div>
                            <div className="restaurant-avg-cost-section">
                                <div className="restaurant-avg-cost">
                                    <i className="fa fa-inr" aria-hidden="true"></i>
                                    <Typography
                                        variant="subtitle1"
                                        component="p"

                                    >
                                        {this.state.restaurantDetails.avgCost}
                                    </Typography>
                                </div>
                                <Typography
                                    variant="caption"
                                    component="p"

                                >
                                    AVERAGE COST FOR TWO PEOPLE
                                    </Typography>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Menu and Cart Card Container */}
                <div className="menu-details-cart-container">

                    {/* menu -section */}
                    <div className="menu-details">

                        {/* Iterating for each category in the categories array to display each category */}
                        {this.state.categories.map((category) => (
                            <div key={category.id}>
                                <Typography variant="overline" component="p"
                                    className={classes.categoryName}
                                >
                                    {category.category_name}
                                </Typography>

                                <Divider />

                                {/* Iterating over each item to display each items in the category. */}
                                {category.item_list.map((item) => (
                                    <div className="menu-item-container" key={item.id}>
                                        {
                                            item.item_type === "NON_VEG" ?
                                                <i className="fa fa-circle" aria-hidden="true" style={{ color: "#BE4A47" }}></i>
                                                :
                                                <i className="fa fa-circle" aria-hidden="true" style={{ color: "#5A9A5B" }}></i>

                                        }



                                        <Typography variant="subtitle1" component="p" className={classes.menuItemName}>

                                            {item.item_name[0].toUpperCase() + item.item_name.slice(1)}

                                        </Typography>

                                        <div className="item-price">

                                            <i className="fa fa-inr" aria-hidden="true"></i>

                                            <Typography variant="subtitle1" component="p" className={classes.itemPrice}  >
                                                {item.price.toFixed(2)}
                                            </Typography>

                                        </div>


                                        <IconButton
                                            className={classes.addButton}
                                            aria-label="add"
                                            onClick={() => this.itemAddButtonClickHandler(item)}
                                        >
                                            <AddIcon />
                                        </IconButton>

                                    </div>
                                ))}

                            </div>
                        ))}
                    </div>



                    {/* My Cart Section */}
                    <div className="my-cart">
                        <Card className={classes.myCart}>


                            <CardHeader avatar={
                                <Avatar aria-label="shopping-cart" className={classes.shoppingCart}>

                                    <Badge
                                        badgeContent={this.state.cartItems.length}
                                        color="primary"
                                        showZero={true}
                                        invisible={this.state.badgeVisible}
                                        className={classes.badge}
                                    >
                                        <ShoppingCartIcon />
                                    </Badge>
                                </Avatar>
                            }
                                title="My Cart"
                                titleTypographyProps={{ variant: "h6", }}
                                className={classes.cartHeader}
                            />


                            <CardContent className={classes.cardContent}>

                                {/* Iterating over each item in cartItem to show in the cart. */}
                                {this.state.cartItems.map((cartItem) => (

                                    <div className="cart-menu-item-container" key={cartItem.id}>

                                        <i className="fa fa-stop-circle-o" aria-hidden="true"
                                            style={{ color: cartItem.itemType === "NON_VEG" ? "#BE4A47" : "#5A9A5B" }}
                                        ></i>

                                        <Typography variant="subtitle1" component="p" className={classes.menuItemName} id="cart-menu-item-name">

                                            {cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}

                                        </Typography>

                                        <div className="quantity-container">

                                            <IconButton
                                                className={classes.cartItemButton}
                                                id="minus-button"
                                                aria-label="remove"
                                                onClick={() => this.cartMinusButtonClickHandler(cartItem)}
                                            >
                                                <i class="fa fa-minus" aria-hidden="true" style={{ color: "black" }}></i>
                                            </IconButton>

                                            <Typography variant="subtitle1" component="p" className={classes.itemQuantity}>
                                                {cartItem.quantity}
                                            </Typography>

                                            <IconButton
                                                className={classes.cartItemButton}
                                                aria-label="add"
                                                onClick={() => this.cartAddButtonClickHandler(cartItem)}
                                            >
                                                <i class="fa fa-plus" aria-hidden="true" style={{ color: "black" }} ></i>

                                            </IconButton>
                                        </div>

                                        <div className="item-price">

                                            <i className="fa fa-inr" aria-hidden="true" style={{ color: "grey" }}></i>

                                            <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="cart-item-price" >

                                                {cartItem.totalAmount.toFixed(2)}

                                            </Typography>
                                        </div>
                                    </div>
                                ))}
                                <div className="total-amount-container">
                                    <Typography variant="subtitle2" component="p" className={classes.totalAmount}>
                                        TOTAL amount
                                          </Typography>


                                    <div className="total-price">

                                        <i className="fa fa-inr" aria-hidden="true"></i>

                                        <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="cart-total-price">

                                            {this.state.totalAmount.toFixed(2)}

                                        </Typography>
                                    </div>

                                </div>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth={true}
                                    className={classes.checkOutButton}
                                    onClick={this.checkOutButtonClickHandler}
                                >
                                    CHECKOUT
                                 </Button>


                            </CardContent>

                        </Card>
                    </div>

                </div>


                {/* to display a corressponding message using Snackbar */}
                <div>
                    <Snackbar anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                        open={this.state.snackBarOpen}
                        autoHideDuration={4000}
                        onClose={this.snackBarClose}
                        TransitionComponent={this.state.transition}
                        ContentProps={{ "aria-describedby": "message-id", }}
                        message={
                            <span id="message-id">
                                {this.state.snackBarMessage}
                            </span>}

                        action={
                            <IconButton color="inherit" onClick={this.snackBarClose}>
                                <CloseIcon />
                            </IconButton>
                        }
                    />
                </div>

            </div >
        )
    }
}


export default withStyles(styles)(Details);