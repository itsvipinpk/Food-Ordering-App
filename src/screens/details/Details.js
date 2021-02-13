import React, { Component } from 'react';

//importing Header
import Header from '../../common/header/Header';

//importing the css file of the Details page
import './Details.css';


import '../../../node_modules/font-awesome/css/font-awesome.min.css'
import Typography from "@material-ui/core/Typography";
import { withStyles, CardContent } from "@material-ui/core";

const styles = (theme) => ({

    restaurantName: {
        padding: "8px 0px 8px 0px",
        "font-size": "30px",
    }
})


class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurantDetails: [],
            categories: [],
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
                    restaurantDetails: restaurantDetails,
                    categories: categoriesList,
                });


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


                        {/* <div className="rating-and-avg-section">
                            
                            <div className="restaurant-rating-section">
                                <Typography variant='body1'>
                                    <i className="fa fa-star"></i> {this.state.restaurantDetails.rating} ({this.state.restaurantDetails.number_customers_rated})
                                                </Typography>
                            </div>
                           
                            <div className="restaurant-avg-price-section">
                                <Typography variant='body1'>
                                    <i className="fa fa-inr" aria-hidden="true"></i>{this.state.restaurantDetails.average_price} for two
                                            </Typography>
                            </div>
                        </div> */}

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
                                    AVERAGE RATING BY
                                    {
                                        <span className="restaurant-NoOfCustomerRated">
                                            {this.state.restaurantDetails.noOfCustomerRated}
                                        </span>
                                    }
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


            </div>
        )
    }
}

export default Details;