Backend Recruitment Task


Run it as (npm install && npm start) <br/>
Access the API at localhost:3000/cities <br/>
Query params are country page limit 

Determination of the valid city name is done in 3 steps:

 The extra data at the begining & end of the name is removed .
 At the begining of the name there can generic nouns like station district followed by hyphen
 this fact can be used to construct the regex 
 Trailing strings are the generic nouns in brackets like (Zone), (District)
 
 Then the accent marks are removed followed by triming & replacement of spaces with underscores
 
 Lastly the invalid names can filtered based on wiki API response.
 
 
 Limitations 
 The regex step may fail to sanitize in case the name comes in unexpected format .
 A list of valid city names to search can be a more foolproof but costly way to cover such cases.
