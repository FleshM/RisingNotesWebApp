import './App.css';
import '../Header/Header.css';
import '../Login/Login.css';
import '../Registration/Registration.css';
import  '../Player/Player.css';
import  '../Sidebar/Sidebar.css';
import '../../Pages/Subsriptions/Subscriptions.css';
import '../../Pages/Commentaries/Commentaries.css';
import '../ArtistCard/ArtistCard.css';

import  '../../Pages/ArtistPersonalPage/ArtistPersonalPage.css';
import '../../Pages/ArtistCard/ArtistCard.css';
import '../../Pages/Featured/Featured.css';
import '../LK/LK.css';
import '../InstallMusic/InstallMusic.css';
import '../../Pages/AdminPanel/AdminPanel.css';
import '../Player/FilterComponent/FilterComponent.css';
import '../MusicPlayer/MusicPlayer.css';
import '../../Pages/PlaylistWindow/PlaylistWindow.css';

import Header from "../Header/Header";
import Login from "../Login/Login"
import Registration from "../Registration/Registration";
import Sidebar from "../Sidebar/Sidebar";
import Player from "../Player/Player";
import ArtistPersonalPage from "../../Pages/ArtistPersonalPage/ArtistPersonalPage";

import ArtistCard from '../ArtistCard/ArtistCard'
import LK from "../LK/LK";
import LKlistener from "../LKlistener/LKlistener";
import InstallMusic from "../InstallMusic/InstallMusic";
import InstallMusicMusician from '../InstallMusicMusician/InstallMusicMusician';
import {Routes,Route, Link, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom';
import React, {Fragment} from "react";
import Featured from '../../Pages/Featured/Featured';
import Excluded from '../../Pages/Excluded/Excluded';
import Subscriptions from '../../Pages/Subsriptions/Subscriptions';
import Commentaries from '../../Pages/Commentaries/Commentaries';
import AdminPanel from '../../Pages/AdminPanel/AdminPanel';
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import PlaylistWindow from '../../Pages/PlaylistWindow/PlaylistWindow';

import {useState, useEffect} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'react-cookie';


export const api = 'https://2100237-gs89005.twc1.net/';

export const axiosAuthorized = axios.create({
    baseURL: api,
    headers: {
        "Content-Type": "application/json",
    },
});

export const axiosUnauthorized = axios.create({
    baseURL: api,
    headers: {
        "Content-Type": "application/json",
    },
});

const axiosRefresh = axios.create({
    baseURL: api,
    headers : {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
});

function App() {
    const [songs, setSongs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role']);
  
    //обновление токена
    async function refreshTokens (config) {
        await axiosRefresh.post('connect/token', {
            client_id: 'Api',
            client_secret: 'megaclientsecret',
            grant_type: 'refresh_token',
            refresh_token: cookies.refreshToken
        })
        .then(response => {
            setCookies('accessToken', response.data.access_token, { path: '/' });
            setCookies('refreshToken', response.data.refresh_token, { path: '/' });
            config.headers['Authorization'] = 'Bearer ' + response.data.access_token;
        })
    }
  
    //Вставка токена в запрос и его проверка
    axiosAuthorized.interceptors.request.use(
        async config => {
            const accessToken = cookies.accessToken;
            const refreshToken = cookies.refreshToken;
            if (accessToken) {
                let decoded = jwtDecode(accessToken);
                setCookies('authorId', decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"])
                setCookies('role', decoded.role)
                if (decoded.exp > new Date().getTime()/1000)
                    config.headers['Authorization'] = 'Bearer ' + accessToken;
                else {
                    await refreshTokens(config);
                }  
            }
            else if (refreshToken) {
                await refreshTokens(config);
            }
            return config;
        },
        error => {
            Promise.reject(error);
            console.log(error);
        }
    );

    useEffect(() => {
        axiosUnauthorized.get(`api/author/${'902be286-f22e-43ca-bc16-007de8cdeddd'}/song/list`)
            .then(response => {
                setIsLoaded(true);
                setSongs(response.data.songInfoList);
                console.log(response.data.songInfoList);
            })
            .catch(error => {
                console.error(error);
                throw error;
            });
    }, []);

    if (isLoaded)
    return (
      <div className="App">
          <Header/>
          <MusicPlayer songsInfo={songs}/>
          <Sidebar></Sidebar>
          <Routes>
              <Route path={'/'} element={<Player/>}/>
              <Route path={'/login'} element={<Login/>}/>
              <Route path={'/registration'} element={<Registration/>}/>
              <Route path={'/artist/:id'} element={<ArtistCard/>}/>
              <Route path={'/featured'} element={<Featured/>}/>
              <Route path={'/excluded'} element={<Excluded/>}/>
              <Route path={'/account'} element={<LK/>}/>
              {/* <Route path={'/LKlistener'} element={<LKlistener/>}/> */}
              <Route path={'/upload'} element={<InstallMusic/>}/>
              <Route path={'/subscriptions'} element={<Subscriptions/>}/>
              <Route path={'/commentaries/:id'} element={<Commentaries/>}/>
              <Route path={'/adminpanel'} element={<AdminPanel/>}/>
              <Route path={'/artistpage'} element={<ArtistPersonalPage/>}/>
              <Route path={'/playlist'} element={<PlaylistWindow/>}/>
          </Routes>  
      </div>
    );
}

export default App;
