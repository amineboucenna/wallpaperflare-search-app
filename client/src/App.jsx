import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './app.css';

function App() {
  const [backendData, setBackEndData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const query = formData.find || 'space';
      const limit = formData.limit || 12;
      const response = await fetch(`/api/search?query=${query}&limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setBackEndData(data);
      } else {
        console.error(`fetch error. status code: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch('/api/search?query=space')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBackEndData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  return (
    <div>
      <p>Wallpaperflare relevant images</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('find')} type="search" id="find" defaultValue="space" />
        <input {...register('limit')} type="number" id="limit" defaultValue="12" min="1" max="50" />
        <button type="submit">Find</button>
      </form>

      <div className="grid" >
        {loading ? (
          <p>Loading...</p>
        ) : (
          backendData.map((link, i) => (
            <img key={i} src={link} />
          ))
        )}
      </div>
      
    </div>
 
          
 );
}

export default App;
