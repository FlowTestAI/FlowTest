import React, { useRef, useState, useEffect } from 'react';

//mui
import {
  Fab,
  Popper,
  Fade,
  Paper,
  Typography,
  Box,
  Stack,
  List,
  ListItemButton,
  ListItem,
  ListItemText,
  Divider,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { blue, green } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// icons
import { IconMinus, IconPlus } from '@tabler/icons-react';

import collectionApi from '../api/collection';
import wrapper from '../api/wrapper';

import PerfectScrollbar from 'react-perfect-scrollbar';

const fabStyle = {
  position: 'absolute',
  bottom: 20,
  right: 15,
};

const fabGreenStyle = {
  color: 'common.white',
  bgcolor: blue[500],
  '&:hover': {
    bgcolor: blue[600],
  },
};

const requestNodes = [
  {
    requestType: 'GET',
    description: 'GET is used to request data from a specified resource.',
    type: 'requestNode',
  },
  {
    requestType: 'POST',
    description: 'POST is used to send data to a server to create/update a resource.',
    type: 'requestNode',
  },
  {
    requestType: 'PUT',
    description: 'PUT is used to send data to a server to create/update a resource. PUT requests are idempotent.',
    type: 'requestNode',
  },
  {
    requestType: 'DELETE',
    description: 'The DELETE method deletes the specified resource.',
    type: 'requestNode',
  },
];

const outputNode = {
  description: 'Displays any data received.',
  type: 'outputNode',
};

const evaluateNode = {
  description: 'Evaluate conditional expressions.',
  type: 'evaluateNode',
};

const delayNode = {
  description: 'Add a certain delay before next computation.',
  type: 'delayNode',
};

const AddNodes = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const ps = useRef();

  const onDragStart = (event, node) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  const getAllCollectionsApi = wrapper(collectionApi.getAllCollection);

  // Get All collections
  const [savedCollections, setSavedCollections] = useState([]);

  useEffect(() => {
    if (getAllCollectionsApi.data) {
      const retrievedCollections = getAllCollectionsApi.data;
      console.log('Got saved collections: ', retrievedCollections);
      setSavedCollections(retrievedCollections);
    } else if (getAllCollectionsApi.error) {
      const error = getAllCollectionsApi.error;
      if (!error.response) {
        console.log('Failed to get saved collections: ', error);
      } else {
        const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`;
        console.log('Failed to get saved collections: ', errorData);
      }
    }
  }, [getAllCollectionsApi.data, getAllCollectionsApi.error]);

  // Initialization
  useEffect(() => {
    getAllCollectionsApi.request();
  }, []);

  return (
    <>
      <Fab
        color='inherit'
        aria-label='Add'
        title='Add Node'
        sx={{ ...fabStyle, ...fabGreenStyle }}
        onClick={() => setOpen(!open)}
        ref={anchorRef}
      >
        {open ? <IconMinus /> : <IconPlus />}
      </Fab>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement='top'
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [-40, 14],
              },
            },
          ],
        }}
        sx={{ zIndex: 1000 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Card elevation={16}>
                <Box sx={{ p: 2 }}>
                  <Stack>
                    <Typography variant='h6' align='center'>
                      Add Nodes
                    </Typography>
                  </Stack>
                </Box>
                <PerfectScrollbar
                  containerRef={(el) => {
                    ps.current = el;
                  }}
                  style={{ height: '100%', maxHeight: 'calc(100vh - 320px)', overflowX: 'hidden' }}
                >
                  <Box sx={{ p: 2 }}>
                    <List
                      sx={{
                        width: '100%',
                        maxWidth: 370,
                        borderRadius: '10px',
                        padding: '16px',
                        '& .MuiListItemSecondaryAction-root': {
                          top: 22,
                        },
                        '& .MuiDivider-root': {
                          my: 0,
                        },
                        '& .list-container': {
                          pl: 7,
                        },
                      }}
                    >
                      <Accordion key='requests' disableGutters>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls='panel1a-content'
                          id='panel1a-header'
                        >
                          <Typography variant='h7'>Requests</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {requestNodes.map((node, index) => (
                            <div
                              key={`${node.requestType}-${index}`}
                              onDragStart={(event) => onDragStart(event, node)}
                              draggable
                              cursor='move'
                            >
                              <ListItemButton>
                                <ListItem alignItems='center'>
                                  <ListItemText
                                    sx={{ ml: 1 }}
                                    primary={node.requestType}
                                    secondary={node.description}
                                  />
                                </ListItem>
                              </ListItemButton>
                              {index === requestNodes.length - 1 ? null : <Divider />}
                            </div>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                      {savedCollections.map((collection, index) => (
                        <Accordion key={collection.id} disableGutters>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel1a-content-${collection.id}`}
                            id={`panel1a-header-${collection.id}`}
                          >
                            <Typography variant='h7'>{collection.name}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {JSON.parse(collection.nodes).map((node, index1) => (
                              <div
                                key={`${node.requestType} - ${node.operationId}`}
                                onDragStart={(event) => {
                                  const newNode = {
                                    ...node,
                                    type: 'requestNode',
                                  };
                                  onDragStart(event, newNode);
                                }}
                                draggable
                                cursor='move'
                              >
                                <ListItemButton>
                                  <ListItem alignItems='center'>
                                    <ListItemText
                                      sx={{ ml: 1 }}
                                      primary={`${node.requestType} - ${node.operationId}`}
                                      secondary={node.description}
                                    />
                                  </ListItem>
                                </ListItemButton>
                                {index1 === JSON.parse(collection.nodes).length - 1 ? null : <Divider />}
                              </div>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                      <Accordion key='output' disableGutters>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls='panel1a-content-output'
                          id='panel1a-header-output'
                        >
                          <Typography variant='h7'>Output</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div
                            key='output'
                            onDragStart={(event) => onDragStart(event, outputNode)}
                            draggable
                            cursor='move'
                          >
                            <ListItemButton>
                              <ListItem alignItems='center'>
                                <ListItemText sx={{ ml: 1 }} primary='Output' secondary={outputNode.description} />
                              </ListItem>
                            </ListItemButton>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion key='evaluate' disableGutters>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls='panel1a-content-output'
                          id='panel1a-header-output'
                        >
                          <Typography variant='h7'>Evaluate</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div
                            key='evaluate'
                            onDragStart={(event) => onDragStart(event, evaluateNode)}
                            draggable
                            cursor='move'
                          >
                            <ListItemButton>
                              <ListItem alignItems='center'>
                                <ListItemText sx={{ ml: 1 }} primary='Evaluate' secondary={evaluateNode.description} />
                              </ListItem>
                            </ListItemButton>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion key='delay' disableGutters>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls='panel1a-content-output'
                          id='panel1a-header-output'
                        >
                          <Typography variant='h7'>Delay</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div
                            key='delay'
                            onDragStart={(event) => onDragStart(event, delayNode)}
                            draggable
                            cursor='move'
                          >
                            <ListItemButton>
                              <ListItem alignItems='center'>
                                <ListItemText sx={{ ml: 1 }} primary='Delay' secondary={delayNode.description} />
                              </ListItem>
                            </ListItemButton>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </List>
                  </Box>
                </PerfectScrollbar>
              </Card>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default AddNodes;
