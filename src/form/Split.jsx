import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Split({trimFnc}) {
  const [splitTime, setSplitTime] = useState(0);
  const [disabled, setDiabled] =  useState(false);

  async function handelSubmit(e){
    e.preventDefault();
    setDiabled(true);
    await trimFnc(splitTime);
    setDiabled(false);
  }

  return (
    <Form onSubmit={handelSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Split At</Form.Label>
        <Form.Control type="number" placeholder="0" step="0.1" onChange={(e) => setSplitTime(e.target.value)} />
        <Form.Text className="text-muted">
          When to split, in seconds.
        </Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={disabled}>
        {disabled ? "Spliting.." : "Split"}
      </Button>
    </Form>
  );
}

export default Split;
