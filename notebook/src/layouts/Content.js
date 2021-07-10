import React, { useState, useEffect } from "react";


import { Container, Navbar, FormControl, Row, Col, Button, Card, Form, Modal } from "react-bootstrap";

function Content (props) {

    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [notes, setNotes] = useState([]);
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState({
        id: 0,
        judul: "",
        isi: ""
    });

    const reloadData = () =>{
        props.api.get("/notes").then(res => {
            let sorted = res.data.sort(function (a, b) {
                return a.id < b.id ? 1 : b.id < a.id ? -1 : 0
            })
            setNotes(sorted);
            setEdit(false);
        });

    }

    useEffect(() => {
        reloadData();
    }, []);

    const clearData = () =>{
        let newDataPost = {...data};
        newDataPost['id'] = "";
        newDataPost['judul'] = "";
        newDataPost['isi'] = "";

        setData(newDataPost);
    }

    const onSubmitForm = () =>{

        if(data.judul == "" && data.isi == ""){
            handleShow();
            setEdit(false);
        }else if(data.judul == ""){
            document.getElementById('judul').placeholder = "Judul Tidak Boleh Kosong";
        }else if(data.isi == ""){
            document.getElementById('isi').placeholder = "Isi Tidak Boleh Kosong";
        }else if(edit === false){
          props.api.post('/notes', data)
          .then(()=> {
              reloadData();
              clearData();
          });
        }else if(edit === true && data.judul !== "" && data.isi !== ""){
            props.api.put(`/notes/${data.id}`, data)
            .then(()=>{
                reloadData();
                clearData();
            });
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRemove = (e) =>{

        if (window.confirm('Are you sure you wish to delete this item?')){
            fetch(`http://localhost:3006/notes/${e.target.value}`, {
            method: "DELETE"
            }).then(res => {reloadData();});
        }
    
    }

    const inputChange = (e) =>{

        let newDataPost = {...data};

        if(edit === false){
          newDataPost['id'] = new Date().getTime();
        }

        newDataPost[e.target.name] = e.target.value;
  
        setData(newDataPost);
    }

    const getDataId = (e) =>{

        props.api.get(`/notes/${e.target.value}`).then(res => {
            setData(res.data);
            setEdit(true);
        });

        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="md" style={{borderRadius: "0px 0px 15px 15px"}}>
                <Container>
                    <Navbar.Brand href="#">My Awesome Notebook</Navbar.Brand>
                    <Navbar.Toggle aria-controls="search" />
                    <Navbar.Collapse id="search">
                        <Form inline style={{marginLeft: "auto"}}>
                            <FormControl type="text" placeholder="Find any of your notes..." className="mr-sm-2" style={{borderColor: "blue", width: "300px"}} onChange={(e) => {setSearchTerm(e.target.value)}} />
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Row className="mt-4 justify-content-center">
                    <Col sm={12} md={6}>
                        <Form style={{backgroundColor: "#EAF2F8", padding: "50px", borderRadius: "10px"}}>
                        <div className="text-center mb-4">
                            <h2>Catatan Baru</h2>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Judul Catatan</Form.Label>
                            <Form.Control id="judul" type="text" name="judul" value={data.judul} onChange={inputChange} placeholder="Judul Catatan"/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Isi</Form.Label>
                            <Form.Control id="isi" as="textarea" rows={5} name="isi" value={data.isi} onChange={inputChange} placeholder="Isi Catatan"/>
                        </Form.Group>

                            <Button variant="primary" onClick={onSubmitForm} style={{width: "100%"}}>+ Add Notes</Button>
                        </Form>
                        <Modal show={show} onHide={handleClose}> 
                            <Modal.Header closeButton> 
                                <Modal.Title>Informasi</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Judul dan Isi tidak boleh kosong, silahkan masukkan data baru !</Modal.Body>
                            <Modal.Footer> 
                                <Button variant='secondary' onClick={handleClose}> Close </Button> <Button variant='primary' onClick={handleClose}> OK </Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
                 {notes.filter((keyword) => {
                     if(searchTerm == ""){
                         return keyword;
                     }else if(keyword.judul.toLowerCase().includes(searchTerm.toLowerCase())){
                         return keyword;
                     }
                 }).map((data, index) =>{
                     return (
                        <div>
                            <Card className="mt-4 mb-4" key={index}>
                                <Card.Header as="h5">{++index}. {data.judul}</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        {data.isi}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="text-right">
                                    <span>
                                        <Button value={data.id} onClick={getDataId} variant="outline-warning" style={{width:"90px", marginRight: "5px"}}>Edit</Button>
                                        <Button value={data.id} onClick={handleRemove} variant="outline-danger" style={{width:"90px", marginRight: "5px"}}>Delete</Button>
                                    </span>
                                </Card.Footer>
                            </Card>
                            <hr/>
                        </div>
                        );
                    })
                 }

                <hr/>     
            </Container>
        </div>
    );
}

export default Content;