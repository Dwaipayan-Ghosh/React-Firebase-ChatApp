import React , { useRef, useState} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore} from 'firebase/firestore'

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
      const provider = new app.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
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
  const messageRef = db.collection('messages')
  const query = messageRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, {idField : 'id'});

  const [formvalue, setFormvalue] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { uid } = auth.currentUser;

    await messageRef.add({
      text: formvalue,
      createdAt : app.firestore.FieldValue.serverTimestamp(),
      uid,
    })

    setFormvalue('')
    dummydata.current.scrollIntoView({behavior : 'smooth'})

  }

  return (<>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}

      <span ref={dummydata}></span>
    </div>
    <form onSubmit={handleSubmit}>
      <input value={formvalue} onChange={(e) => setFormvalue(e.target.value)} placeholder="Say something Nice!!"/>
      <button type="submit" disabled={!formvalue}>Send</button>
    </form>
  </>)
}

const ChatMessage = (props) => {
  const { text, uid, createdAt } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'send' : 'receive';

  return(
    <>
      <div className={`message ${messageClass}`}><p>{text}</p></div >
    </>
  );
}
 



export default App;
