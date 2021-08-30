import React , { useRef, useState, useEffect} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { getFirestore, collection, orderBy, limit, addDoc,query, getDocs, serverTimestamp } from 'firebase/firestore'

import './App.css'




const app = initializeApp({
  apiKey: "AIzaSyDx99NhOwy88TJw64A3GAPwleheXAAqwgM",
  authDomain: "superchat-ee662.firebaseapp.com",
  projectId: "superchat-ee662",
  storageBucket: "superchat-ee662.appspot.com",
  messagingSenderId: "869134918674",
  appId: "1:869134918674:web:3a940c8b7e1fa4274ba4cb",
  measurementId: "G-SP8GYPXM7M"
}); 

const auth = getAuth(app);
const db = getFirestore(app);


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
      
    </div>
  );
}

const SignIn = () => {
    
  const SignInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider);
  }

  return (  
      <div>
          <button className="sign-in" onClick={SignInWithGoogle}>Sign In With Google</button>
      </div>
  );
}

const  SignOut = () => {
  return auth.currentUser && (  
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  );
}

const ChatRoom = () => {
  const dummydata = useRef();
  const messagethread = []

  // const GETMSG  = async () => {
  //   const q = query(collection(db,'messages'),orderBy('createdAt','desc'),limit(25));
  //   const response = await getDocs(q);
  //   var messages = []
  //   response.forEach(res => {
  //     messages.push(res.data())
  //     // console.log(res.data())
  //   });
  //   return messages;
  // }
  
  
  // useEffect(() => {
  //   async function doTask(){
  //   let data = await GETMSG();
    
  //   for (var i of data){
  //     messagethread.push(data)
  //     console.log(messagethread)
  //   }
  //   // return messagethread;
  // }
  // doTask()
  // },[messagethread])


  console.log(messagethread)
  const [formvalue, setFormvalue] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const  uid  = auth.currentUser.uid;

    await addDoc(collection(db,'messages'), {
      text: formvalue,
      createdAt : serverTimestamp(),
      uid,
    })
    
    setFormvalue('')
    dummydata.current.scrollIntoView({behavior : 'smooth'})

  }

  return (<>
    <main>
      
      {console.log(messagethread.length)}
      {messagethread && messagethread.forEach(msg => console.log(msg))}
      <span ref={dummydata}></span>
    </main>
    <form onSubmit={handleSubmit}>
      <input value={formvalue} onChange={(e) => setFormvalue(e.target.value)} placeholder="Say something Nice!!"/>
      <button type="submit" disabled={!formvalue}>Send</button>
    </form>
  </>)
}

const ChatMessage = (props) => {
  const { text, uid, createdAt } = props.message;
  console.log(props)
  const messageClass = (uid === auth.currentUser.uid) ? 'send' : 'receive';

  return(
    <>
      <div className={`message ${messageClass}`}><p>{text}</p></div >
    </>
  );
}
 



export default App;
