import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import {Login, Home, Public, FAQ, ProductDetail, Products, Blogs, Services, CompleteRegister} from './pages/public';
import path from './utils/path';
import {getCategories} from './store/app/asyncActions'
import {useDispatch} from 'react-redux';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />} > 
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.PRODUCT_DETAIL__PID__TITLE} element={<ProductDetail />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.OUR_SERVICES} element={<Services />} />
          <Route path={path.PRODUCTS} element={<Products />} />
        </Route>
        <Route path={path.COMPLETE_REGISTER} element={<CompleteRegister/>} />
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
