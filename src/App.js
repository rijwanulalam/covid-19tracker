import { Card, CardContent, FormControl, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import "./App.css";
import InfoBox from "./components/InfoBox/InfoBox";
import LineGraph from "./components/LineGraph/LineGraph";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import { prettyPrintStat, sortData } from "./components/Table/util";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");

  // https://disease.sh/v3/covid-19/countries
  // USEEFFECT = Runs a piece of code based on a given  condition.
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() =>{
      // async = send a request, wait for it, do something it.
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) =>{
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries); 
        });
      };
      getCountriesData();
  }, []);
  const countryChange = async (e) => {
    const countryCode = e.target.value;
    
    
    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        
      });
    
  }
  return (
    <div className="app">
      <div className="app_left">
      <div className="app_header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app_dropdown">
            <Select variant="outlined" onChange={countryChange} value={country} >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
        </FormControl>
      </div>

      <div className="app_infos">
              <InfoBox isRed active={casesType==="cases"} onClick={(e) => setCasesType("cases")} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}></InfoBox>
              <InfoBox active={casesType==="recovered"} onClick={(e) => setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}></InfoBox>
              <InfoBox isRed active={casesType==="deaths"} onClick={(e) => setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}></InfoBox>
      </div>

      

      

      {/* Map */}
      <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}></Map>

      </div>

      <Card className="app_right">
        <CardContent>
        <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
        <h3>Worldwide new {casesType}</h3>
              <LineGraph casesType={casesType}></LineGraph>
        </CardContent>
        
      </Card>
      
    </div>
  );
}

export default App;
