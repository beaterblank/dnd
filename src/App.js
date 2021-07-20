//version control 0.0
//making the basic project with react js -> 0.0
//imports
import React, { useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
//hooks
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

//config for firebase
var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "dnd-cloud.firebaseapp.com",
  projectId: "dnd-cloud",
  storageBucket: "dnd-cloud.appspot.com",
  messagingSenderId: "640257858184",
  appId: "1:640257858184:web:dcaf086e1321475f8f5d3d",
  measurementId: "G-PN8Q996353"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//reference to auth and firestore sdk as global variables
const auth = firebase.auth();
const firestore = firebase.firestore();
var room = prompt("room id") ;


function App() {
  //auth checker
  const[user] = useAuthState(auth);
  //if an user is present we can show chatroom or we can signin
  return (
    <div className="wrapper">
      <div className="chatapp">
        <section>
            {user ? <Chatroom />:<SignIn />}
        </section>
        {<SignOut />}
      </div>
      
    </div>
  );
}

function SignIn(){
  const SignInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (<button onClick = {SignInWithGoogle}>Sign in with Google</button>)
}
function SignOut(){
  return auth.currentUser && (<button onClick = {()=>{auth.signOut()}}>signOut</button>)
}
function Chatroom(){
 firestore.collection(room).doc("temp").set({});
 const messagesRef = firestore.collection(room)
 const query = messagesRef.orderBy('createdAt');
 const [messages] = useCollectionData(query,{'idField':'id'});
 const [formValue, setFormValue] = useState("")
 const sendMessage = async(e)=>{
    e.preventDefault();
    const{uid,photoURL}=auth.currentUser
    await messagesRef.add({
      text:formValue,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    })
    setFormValue('')
  }
 return (
   <>
   <div className="messages">
     {messages && messages.map(msg=><ChatMessage key = {msg.id} message={msg} />)}
   </div>
   <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
    </form>
   </>
 )
}
function ChatMessage(props){
  const {text,uid,photoURL}=props.message;
  const messageClass = (uid === auth.currentUser.uid)?'sent':'recv';
  return (<div className = {`message-${messageClass}`}><img src={photoURL} alt="img" /><p className="message-content">{text}</p></div>)
}
export default App;
