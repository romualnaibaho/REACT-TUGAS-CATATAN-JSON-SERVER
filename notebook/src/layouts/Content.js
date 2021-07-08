import React, { useState, useEffect } from "react";


import { Container, Navbar, FormControl, Row, Col, Button, Card, Form } from "react-bootstrap";

function Content (props) {

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
            setNotes(res.data);
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

        if(edit === false){
          props.api.post('/notes', data)
          .then(()=> {
              reloadData();
              clearData();
          });
        }else{
            props.api.put(`/notes/${data.id}`, data)
            .then(()=>{
                reloadData();
                clearData();
            });
        }
    }

    const handleRemove = (e) =>{
        fetch(`http://localhost:3006/notes/${e.target.value}`, {
            method: "DELETE"
          }).then(res => {reloadData();});
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
            <Navbar bg="dark" variant="dark" style={{borderRadius: "0px 0px 15px 15px"}}>
                <Container>
                    <Navbar.Brand href="#">My Awesome Notebook</Navbar.Brand>
                    <Form inline style={{marginLeft: "auto"}}>
                        <FormControl type="text" placeholder="Find any of your notes..." className="mr-sm-2" style={{borderColor: "blue", width: "300px"}} onChange={(e) => {setSearchTerm(e.target.value)}} />
                    </Form>
                </Container>
            </Navbar>
            <Container>
                <Row className="mt-4 justify-content-center">
                    <Col md={4}>
                        <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Judul Catatan</Form.Label>
                            <Form.Control type="text" name="judul" value={data.judul} onChange={inputChange} placeholder="Judul Catatan"/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Isi</Form.Label>
                            <Form.Control as="textarea" rows={5} name="isi" value={data.isi} onChange={inputChange} placeholder="Isi Catatan"/>
                        </Form.Group>

                            <Button variant="primary" onClick={onSubmitForm} style={{width: "100%"}}>+ Add Notes</Button>
                        </Form>
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
                        <Card className="mt-4" key={index}>
                            <Card.Header as="h5">{data.judul}</Card.Header>
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
                        );
                    })
                 }

                <hr/>     
            </Container>
        </div>
    );
}

export default Content;