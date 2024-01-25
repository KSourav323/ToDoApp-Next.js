'use client';
import { useState, useEffect } from 'react'
import { useRouter} from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import './home.css'
import "bootstrap/dist/css/bootstrap.css"
import axios from 'axios';


function Home() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const router = useRouter();

    const info = {
            "firstname": "Sourav",
            "lastname": "K",
            "email": "mail@gmail.com",
            "phone": "9996677",
            "address": "abc house, kannur"

          };
    const [notes, setNotes] = useState('');
    const [newnote, setNewNote] = useState(' ');

    useEffect( () => {
        async function load(){

            axios.get('http://localhost:8080/home/', { params: { email: email } })
                .then(res => {
                    const usernotes = res.data.notes;
                    if (res.status == 200) {
                        setNotes(usernotes)
                    }
                    else if (res.data == 'notsuccess') {
                        console.log('here')
                        router.replace('/');
                    }
                })
                .catch(err => {
                    console.log('exception');
                    router.replace('/');
                });
            }
        load()
       
    })

    const logout = async () => {
        try {
            const response = await axios.get('http://localhost:8080/logout/', { withCredentials: true });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogoutClick = () => {
        logout()
        router.replace('/');
    };


    async function handleSave(event) {
        event.preventDefault();

        await axios.post('http://localhost:8080/home/', { email, newnote })
            .then(res => {
                const queryString = `?email=${email}`; 
                const path = '/profile' + queryString;
                router.push(path);
            })
            .catch(err => {
                alert('exception');
            });
        setNewNote('');
    }

    const handleDelete = async (noteId) => {
        const nid = noteId;
        await axios.delete('http://localhost:8080/home/', { data: { noteId: nid, email: email, } }, { withCredentials: true })
            .then(res => {
                if (res.status == 200) {
                    const queryString = `?email=${email}`; 
                    const path = '/profile' + queryString;
                    router.push(path);
                }
                else if (res.data == 'notsuccess') {
                    alert('error');
                }
            })
            .catch(err => {
                alert('exception');
            });

    };

    const handleRefreshClick = async (event) => {
        event.preventDefault();
        await axios.get('http://localhost:8080/home/', { params: { email: email } }, { withCredentials: true })
            .then(res => {
                const usernotes = res.data.notes;
                if (res.status == 200) {
                    const queryString = `?email=${email}`; 
                    const path = '/profile' + queryString;
                    router.push(path);
                }
                else if (res.data == 'notsuccess') {
                    alert('error');
                }
            })
            .catch(err => {
                alert('exception');
            });
    };



    return (

        <>
            <nav className='navbar'>
                <div className='navoptions'>
                    <a className='custom-button' href="#">Home</a>
                    <a className='custom-button' href="#">Settings</a>
                    <a className='custom-button' href="#" onClick={handleRefreshClick}>Refresh</a>
                </div>

                <div>
                    <button className="logoutbtn" onClick={handleLogoutClick}>Logout</button>
                </div>

            </nav>

            <header>
                <h1>Task List</h1>
                <form id="new-task-form">
                    <input
                        type="text"
                        name="new-task-input"
                        id="new-task-input"
                        placeholder="What do you have planned?"
                        value={newnote}
                        onChange={(e) => setNewNote(e.target.value)} />
                    <button id="new-task-submit" onClick={handleSave}>Save</button>
                </form>
            </header>


            <main>
                <section className="task-list">
                    <h2>Tasks</h2>
                    <div id="tasks">
                        {notes.length === 0 ? (
                            <p className='para'>No notes found for this email.</p>
                        ) : (
                            <ul>
                                {notes.map((noteEntry) => {

                                    const key = noteEntry._id;
                                    return (
                                        <div className="task">
                                            <div className="content">
                                                <input
                                                    type="text"
                                                    className="text"
                                                    value={noteEntry.note}
                                                    readOnly />

                                            </div>

                                            <div className='actions'>
                                                <button className='delete' onClick={() => handleDelete(key)}>DELETE</button>
                                            </div>
                                        </div>
                                    );
                                }
                                )}

                            </ul>
                        )}
                    </div>



                </section>
            </main>
            <footer className='footer'>

                <div className="dropup">
                    <button className="dropbtn">
                        <h6>Logged in as: {info.firstname}</h6>
                    </button>

                    <div className="dropup-content">
                        <h6>Profile:</h6>
                        <div className="pic">
                            <img className="profilepic" src="src/assets/def.jpg" alt="src/assets/def.jpg" />
                        </div>
                        <br />
                        <h6>First name: {info.firstname}</h6>
                        <br />
                        <h6>Last name: {info.lastname}</h6>
                        <br />
                        <h6>Email: {info.email}</h6>
                        <br />
                        <h6>Phone: {info.phone}</h6>
                        <br />
                        <h6>Address: {info.address}</h6>
                    </div>
                </div>

            </footer>
        </>
    );
}

export default Home
