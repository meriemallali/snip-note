import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../App'; 

describe('AddNoteComponent', () => {
  it('should log the user in if the user pressed log in', () => {
    // Render the component
    const { getByTestId, getByText } = render(<App/>);

    // Find input field and "Add" button by their testIDs or other attributes
    const inputField = getByTestId('note-input');
    const addButton = getByText('Add');

    // Simulate user input and button press
    fireEvent.changeText(inputField, 'New Note');
    fireEvent.press(addButton);

    // Verify that the new note is added to the UI or state
    const newNote = getByText('New Note');
    expect(newNote).toBeTruthy();
  });
});
