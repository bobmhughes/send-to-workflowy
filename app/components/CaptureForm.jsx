import React, { useState } from 'react';
import useInput from '../hooks/useInput';
import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';

import { Button, CircularProgress } from '@chakra-ui/react';
import { Input, Textarea } from '@chakra-ui/react';

import Message from './Message';

const messages = {
  success: 'Sent!',
  error: 'Error connecting to WorkFlowy, please check your configuration.',
};

export default function CaptureForm(props) {
  const { parentId, sessionId, top } = props;

  const priority = top ? 0 : 10000000;

  const { value: text, bind: bindText, reset: resetText } = useInput('');
  const { value: note, bind: bindNote, reset: resetNote } = useInput('');

  const [status, setStatus] = useState('');

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    setStatus('loading');
    try {
      const response = await fetch('/send', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, note, sessionId, parentId, priority }),
      });
      if (response.ok) {
        setStatus('success');
        resetText();
        resetNote();
      } else {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        {['error', 'success'].includes(status) && (
          <Message message={messages[status]} status={status} />
        )}
        <FormControl id="text" mt="4">
          <FormLabel>Text:</FormLabel>
          <Input type="text" {...bindText} />
          <FormHelperText>Text to go in your new WorkFlowy node</FormHelperText>
        </FormControl>
        <FormControl id="note" mt="4">
          <FormLabel>Note:</FormLabel>
          <Textarea type="text" {...bindNote} />
          <FormHelperText>Add a note, why not?</FormHelperText>
        </FormControl>
        <Button
          width="full"
          mt={4}
          variantcolor="#597e8d"
          variant="outline"
          type="submit"
          value="Submit"
        >
          {status === 'loading' ? (
            <CircularProgress isIndeterminate size="24px" color="teal" />
          ) : (
            'Send'
          )}
        </Button>
      </form>
    </>
  );
}
