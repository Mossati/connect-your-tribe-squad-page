// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'

// Haal alle squads uit de WHOIS API op
const squadData = await fetchJson(apiUrl + '/squad')

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

//Verwerken van url-gecodeerde data in POST-verzoeken
app.use(express.urlencoded({extended: true}))

// Maak een GET route voor de index
app.get('/', function (request, response) {
  // Haal alle personen uit de WHOIS API op
  fetchJson(apiUrl + '/person').then((apiData) => {
    //Formateer het custom veld van de API naar een JSON format
    apiData.data.forEach((person) => {
      try {
        person.custom = JSON.parse(person.custom);
      } catch (e) {
        person.custom = {};
      }
    });
    // apiData bevat gegevens van alle personen uit alle squads
    // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
    response.render('index', {currentPage: 'index', persons: apiData.data, squads: squadData.data})
  })
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(apiUrl + '/person/' + request.params.id).then((apiData) => {
    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('person', {person: apiData.data, squads: squadData.data})
  })
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/squad/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste squad uit de WHOIS API op
  fetchJson(apiUrl + '/squad/' + request.params.id).then((apiData) => {
    //Filter alle studenten met de aangegeven squad id
    fetchJson(apiUrl + '/person?filter[squad_id]=' + request.params.id).then((personData) => {
      //Formateer het custom veld van de API naar een JSON format
      personData.data.forEach((person) => {
        try {
          person.custom = JSON.parse(person.custom);
        } catch (e) {
          person.custom = {};
        }
      });
      // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
      response.render('squad', {currentPage: 'squad', squad: apiData.data, persons: personData.data, squads: squadData.data})
    })
  })
})

// Maak een POST route voor de index
app.post('/', function (request, response) {
  const personId = request.body.personId;
  // haal de huidige gegevens op van de persoon
  fetchJson(apiUrl + '/person/' + personId).then((apiResponse) => {
    try {
      apiResponse.data.custom = JSON.parse(apiResponse.data.custom)
    } catch (e) {
      apiResponse.data.custom = {}
    }

    // voeg like toe
    apiResponse.data.custom.cardlikes = (apiResponse.data.custom.cardlikes || 0) + 1;

    // overschrijf custom field
    fetchJson(apiUrl + '/person/' + personId, {
      method: 'PATCH',
      body: JSON.stringify({
        custom: apiResponse.data.custom
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then((patchResponse) => {
      response.redirect(303, '/')
    })
  })
})

// Maak een POST route voor de index
app.post('/squad/:id', function (request, response) {
  const personId = request.body.personId;
  // haal de huidige gegevens op van de persoon
  fetchJson(apiUrl + '/person/' + personId).then((apiResponse) => {
    try {
      apiResponse.data.custom = JSON.parse(apiResponse.data.custom)
    } catch (e) {
      apiResponse.data.custom = {}
    }

    // voeg like toe
    apiResponse.data.custom.cardlikes = (apiResponse.data.custom.cardlikes || 0) + 1;

    // overschrijf custom field
    fetchJson(apiUrl + '/person/' + personId, {
      method: 'PATCH',
      body: JSON.stringify({
        custom: apiResponse.data.custom
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then((patchResponse) => {
      response.redirect(303, '/squad/' + apiResponse.data.squad_id)
    })
  })
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
