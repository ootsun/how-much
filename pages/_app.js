import '../styles/globals.css'
import Header from '../components/header/header.js';
import Footer from '../components/footer.js';

function MyApp({ Component, pageProps }) {
  return <div className="flex justify-between flex-col min-h-screen">
    <Header/>
    <div className="px-5">
      <Component {...pageProps}/>
    </div>
    <Footer/>
  </div>
}

export default MyApp
