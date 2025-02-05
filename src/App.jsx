import { useEffect } from "react"
import { fetchDatafromApi } from "./utils/api"
import { useSelector, useDispatch } from 'react-redux'
import { getApiConfiguration, getGenres } from "./store/homeSlice"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import PageNotFound from "./pages/404/PageNotFound";
import Explore from "./pages/explore/Explore"
import Details from './pages/details/Details'
import SearchResult from './pages/searchResult/SearchResult'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  console.log(url)

  useEffect(() => {
    fetchApiConfig();
    genresCall()
  }, [])

  const fetchApiConfig = () => {
    fetchDatafromApi('/configuration').then((res) => {
      console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + 'original',
        poster: res.images.secure_base_url + 'original',
        profile: res.images.secure_base_url + 'original',
      }
      dispatch(getApiConfiguration(url))
    })
  }

  const genresCall = async()=>{
    let promises = []
    let endPoints = ['tv', 'movie']
    let allGenres = {}

    endPoints.forEach((url)=>{
      promises.push(fetchDatafromApi(`/genre/${url}/list`))
    })

    const data = await Promise.all(promises)
    console.log(data)
    data.map(({genres})=>{
      return genres.map((item)=>(allGenres[item.id] = item))
    })
    dispatch(getGenres(allGenres))
  }

  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/:mediaType/:id" element={<Details/>} />
        <Route path="/search/:query" element={<SearchResult/>} />
        <Route path="/explore/:mediaType" element={<Explore/>} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
