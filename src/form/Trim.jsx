import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Trim({trimFnc}) {
  const [st, setSt] = useState(0);
  const [tl, setTl] = useState(0);
  const [disabled, setDiabled] =  useState(false);


  function handelSubmit(e){
    e.preventDefault();
    setDiabled(true)
    trimFnc(st, tl);
  }

  return (
    <Form onSubmit={handelSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Start Time</Form.Label>
        <Form.Control type="number" placeholder="0" step="0.1" onChange={(e) => setSt(e.target.value)} />
        <Form.Text className="text-muted">
          Start Time in Seconds.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Total Length</Form.Label>
        <Form.Control type="number" placeholder="0" step="0.1" onChange={(e) => setTl(e.target.value)} />
        <Form.Text className="text-muted">
          Total Length in Seconds.
        </Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={disabled}>
        {disabled ? "Trimming.." : "Trim"}
      </Button>
    </Form>
  );
}

export default Trim;
