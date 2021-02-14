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
    }
   
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
                console.log(categories)

            }
        })
        xhrRestaurantDetails.open("GET", this.props.baseUrl + "restaurant/" + this.props.match.params.id);
        xhrRestaurantDetails.send(data);
    }
    render() {

        const { classes } = this.props;

        return (
            <div>
                <Header
                    history={this.props.history}
                    baseUrl={this.props.baseUrl}
                    showHeaderSearchBox={false}
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
                                                <i class="fa fa-circle" aria-hidden="true" style={{ color: "#BE4A47" }}></i>
                                                :
                                                <i class="fa fa-circle" aria-hidden="true" style={{ color: "#5A9A5B" }}></i>

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



                </div>

            </div >
        )
    }
}


export default withStyles(styles)(Details);