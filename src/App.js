import logo from './logo.svg';
import './App.css';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import "./sb-admin-2.min.css";
import Dashboard from './Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Userlist from './Userlist';
import Portal from './Portal';
import UserCreate from './UserCreate';
import UserView from './UserView';
import UserEdit from './UserEdit';
import BuildingList from './BuildingList';
import BuildingCreate from './BuildingCreate';
import BuildingEdit from './BuildingEdit';
import BuildingView from './BuildingView';
import CategoryList from './CategoryList';
import CategoryCreate from './CategoryCreate';
import CategoryEdit from './CategoryEdit';

import NewsList from './NewsList';
import NewsCreate from './NewsCreate';
import NewsEdit from './NewsEdit';
import NewsView from './NewsView';
import Staff from './Staff';
import Trantision from './Trantision';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />

        <Route path='/portal' element={<Portal />}>
          {/* <Route path='dashboard' element={<Dashboard />} /> */}
          <Route path='user-list' element={<Userlist />} />
          <Route path='create-user' element={<UserCreate />} />
          <Route path='user-view/:id' element={<UserView />} />
          <Route path='user-edit/:id' element={<UserEdit />} />

          <Route path='building-list' element={<BuildingList />} />
          <Route path='create-building' element={<BuildingCreate />} />
          <Route path='building-edit/:id' element={<BuildingEdit />} />
          <Route path='building-view/:id' element={<BuildingView />} />

          <Route path='category-list' element={<CategoryList />} />
          <Route path='create-category' element={<CategoryCreate />} />
          <Route path='category-edit/:id' element={<CategoryEdit />} />


          <Route path='news-list' element={<NewsList />} />
          <Route path='create-news' element={<NewsCreate />} />
          <Route path='news-edit/:id' element={<NewsEdit />} />
          <Route path='news-view/:id' element={<NewsView />} />

          <Route path='trantision-list' element={<Trantision />} />
        </Route>
        <Route path='/staff' element={<Staff />} >
          <Route path='news-list' element={<NewsList />} />
          <Route path='create-news' element={<NewsCreate />} />
          <Route path='news-edit/:id' element={<NewsEdit />} />
          <Route path='news-view/:id' element={<NewsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
