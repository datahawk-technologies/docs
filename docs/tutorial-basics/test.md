---
sidebar_position: 1
---

# Estimated Monthly Sales

How do we calculate Estimated Monthly Sales and how accurate are they?
Othmane Sghir avatar
Written by Othmane Sghir
Updated over a week ago
The DataHawk Sales Estimator gives you an estimate of the units sold and of the sales made (in your marketplace's currency) during the last 30 days for a certain product.

We also display a historized visualization of daily estimates for a certain product. These features are available provided you track the product on the DataHawk platform.

![image](https://user-images.githubusercontent.com/1514198/151641967-070d3783-a06a-4781-b9cd-c1e99aa4ead1.png)

How do we calculate Estimated Monthly Sales?
At DataHawk we try to provide as close to precise as possible estimates of sales of a product. There are two ways to go about it; 

One is through the use of the Best Seller Rankings 
The Best Seller Rank of a product in any main category is generally a good indication of a product’s sales performance. It is safe to assume that the better a product ranks, the higher number of times it’s been sold. At DataHawk, we have a huge bank of this data collected over a long period of time. Our Data Science team took this historical data, combined it with the knowledge they had, and created a model which could link the best seller rank to quantity sold. As long as the product ranks under a main category, DataHawk Algorithm will compute the information to estimate the number of units sold with high precision.


For products that do not hold a rank under a main category, the estimator takes the number of reviews a product has to compute the sales estimates. 
This is done through the use of our existing proprietary algorithm which looks at how a product's number of reviews have evolved over time and the product age, meaning how long it's been listed on Amazon, then applies certain theoretical reviews rates. This rate of sales per review per day is then inserted into the DataHawk sales estimator algorithm to give you a sales estimate. 

Although this is not as precise as the BSR based sales, it is still a good proxy to use.

Our algorithm uses other metrics and indicators such as changes in the Best Sellers Rank and Keywords Position but hey, it's our secret sauce :) !

How accurate are Estimated Monthly Sales figures?
Based on the computations we ran since April 2021, the sales estimator shows a median error rate of around 35%. Meaning, at least half of the estimations given by the software, as of now, have an accuracy of 65% and above. Our estimates are more accurate for products with a higher number of reviews.

🙄  Need more proof?
We computed the error rate of 20 products in the Amazon-US marketplace across 7 different main categories and compared the results with estimates from our competitors. The following is the result:



DataHawk’s estimator is undoubtedly the most stable sales estimator out there (see average error differences).


To put it simply, even our worst estimates (3rd quartile of error rates) have a 56% error rate which is almost twice better than Jungle Scout and four times better than Helium 10.


DataHawk’s estimator doesn’t allow estimates to be way off. This chart shows that you can trust the vast majority of the estimates we provide.
When looking at our best estimations (1st quartile and median figures), we can confidently say that in addition to being stable, DataHawk’s estimator has one of the best accuracies, especially with top-selling products.


