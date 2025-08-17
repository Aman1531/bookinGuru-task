const POLLUTION_URI="https://be-recruitment-task.onrender.com"
const WIKI_URI='https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&redirects&titles='
const countries = { 'PL' : "Poland" ,
                    'DE' : "Germany",
                    'ES' : "Spain",
                    'FR' : "France"
                  }

var token = null;
const {fetchToken} = require('./token.js')

const cities = async (req, res) => {
      let cleaned_cities = [];
      let cities;
      let final_response = {};
      let country = ('country' in req.query)?req.query.country:"PL";
      let page    = ('page'  in req.query)?req.query.page:1;
      let limit   = ('limit' in req.query)?req.query.limit:10
      let query = `country=${country}&page=${page}&limit=${limit}`;
      token = token?token:await fetchToken();
      try {
      const response = await fetch(POLLUTION_URI + `/pollution?${query}`, {
      method: 'GET',
       headers: {
         'content-type': 'application/json',
         'Authorization': 'Bearer '+ token.token
       },
     })
        cities = await response.json();
        if (!response.ok && cities.error === 'Token expired') {
          let t = await fetchToken(token);
          token.token = t.token;
          token.expiresIn = t.expiresIn;
          const response = await fetch(POLLUTION_URI + `/pollution?${query}`, {
      method: 'GET',
       headers: {
         'content-type': 'application/json',
         'Authorization': 'Bearer '+ token.token
       },
     })

          cities = await response.json();
        }
      
      cleaned_cities =  cities.results.map(async (city) =>
          {
            let name = city.name.toLowerCase().replace(/\([^)]*\)/, "")
                           .replace( /^.*(?=-)-\s+/,"")
                           .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l")
                           .trim().replaceAll(" ","_")
            let begin = city.name.match( /^.*(?=-)-\s+/)
            let end = city.name.match(/\([^)]*\)/)
            begin = begin?begin[0]:""
            end = end?end[0]:""
            name = name.charAt(0).toUpperCase() + name.slice(1)

            return await fetch(WIKI_URI+name)
                 .then(res => res.json())
                 .then( (json) => {
                   let o  = json.query.pages
                   let desc = o[Object.keys(o)[0]].extract
                    if (desc != undefined)
                      return {'name' : begin+name+end,country: countries[country],
                              pollution:city.pollution,description:desc}


                 })

          })

        cleaned_cities = await Promise.all(cleaned_cities)
        final_response = { page:page , limit:limit , total: cities.meta.totalPages*limit,
                           cities : cleaned_cities.filter(c => c != null) }
        res.send(final_response)
      }
      catch(error) {
        console.log(error)
      }

    };


module.exports = {cities}
