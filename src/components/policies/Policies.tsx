import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Divider,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Modal,
  Page,
  PageSection,
  PageSectionVariants,
  Pagination,
  PaginationVariant,
  SkipToContent,
  Spinner,
  Text,
  TextArea,
  TextContent,
  Title,
} from '@patternfly/react-core';

import {
  loadRequest,
  createRequest,
  deleteRequest,
  updateRequest,
} from '../../store/ducks/lab/policy/actions';

import { AppState } from '../../store';

const Policies: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.user.current.token);

  const policyView = useSelector((state: AppState) => state.labPolicy.data);
  const errMsg = useSelector((state: AppState) => state.labPolicy.errMsg);
  const loading = useSelector((state: AppState) => state.labPolicy.loading);
  const error = useSelector((state: AppState) => state.labPolicy.error);

  const [policyId, setPolicyId] = useState<number | undefined>(undefined);
  const [captureError, setCaptureError] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const currentPolicy = policyView[Number(policyId)];
  const policyList = Object.values(policyView);
  const policyPaginated = policyList.slice(
    page * perPage - perPage,
    page * perPage
  );

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [createValue, setCreateValue] = useState<string>('');
  const [editedValue, setEditedValue] = useState<string>('');
  const [validated, setValidated] = useState<
    'default' | 'warning' | 'success' | 'error' | undefined
  >('default');
  const [helperText, setHelperText] = useState<string>('');
  const [invalidText, setInvalidText] = useState<string>('An error occurred');

  const queryPolicy = (): void => {
    dispatch(loadRequest('all'));
  };
  useEffect(queryPolicy, [dispatch, token]);

  // API actions
  const createPolicy = (): void => {
    setCaptureError(true);
    try {
      dispatch(createRequest(JSON.parse(createValue)));
    } catch (e) {
      if (e.name === 'SyntaxError') {
        setCaptureError(false);
        setHelperText('Invalid JSON');
        setValidated('error');
      }
    }
  };

  const editPolicy = (): void => {
    if (editedValue && policyId) {
      try {
        setCaptureError(true);
        dispatch(updateRequest(Number(policyId), JSON.parse(editedValue)));
      } catch (e) {
        if (e.name === 'SyntaxError') {
          setCaptureError(false);
          setHelperText('Invalid JSON');
          setValidated('error');
        }
      }
    }
  };

  const deletePolicy = (): void => {
    if (policyId) {
      setCaptureError(true);
      dispatch(deleteRequest(policyId));
    }
  };

  const removeId = (policies: any) => {
    if (policies) {
      const policiesCopy = { ...policies };
      delete policiesCopy.id;
      return policiesCopy;
    }
    return {};
  };

  const handleModalToggle = React.useCallback(() => {
    setIsExpanded(false);
    setIsModalOpen(!isModalOpen);
    setInvalidText('');
    setHelperText('');
    setValidated(undefined);
  }, [isModalOpen]);

  const onSetPage = (_event: any, pageNumber: number) => {
    setIsExpanded(false);
    setPolicyId(undefined);
    setPage(pageNumber);
  };

  const onPerPageSelect = (_event: any, newPerPage: number) => {
    setPerPage(newPerPage);
  };

  const onTextAreaChange = (newValue: string) => {
    setEditedValue(newValue);
  };

  const onCreateChange = (newValue: string) => {
    setCreateValue(newValue);
  };

  const onSelectDataListItem = (id: string) => {
    setPolicyId(Number(id));
    dispatch(loadRequest(Number(id)));
    setIsExpanded(true);
    setInvalidText('');
    setHelperText('');
    setValidated(undefined);
  };

  const onClose = () => {
    setInvalidText('');
    setHelperText('');
    setValidated(undefined);
    setIsExpanded(false);
    setPolicyId(undefined);
  };

  const errorCallback = React.useCallback(() => {
    if (policyPaginated.length === 0 && page > 1) {
      setPage(page - 1);
    }
    if (captureError) {
      if (loading === false) {
        if (error === true) {
          if ('detail' in errMsg) {
            setValidated('error');
            setHelperText(errMsg.detail);
          }
        } else {
          setValidated('success');
          setHelperText('Success');
          if (isModalOpen) {
            handleModalToggle();
          }
          dispatch(loadRequest('all'));
          setIsExpanded(false);
          setPolicyId(undefined);
        }
        setCaptureError(false);
      }
    }
  }, [
    captureError,
    errMsg,
    error,
    handleModalToggle,
    isModalOpen,
    loading,
    dispatch,
    page,
    policyPaginated,
  ]);

  const setError = (): void => {
    errorCallback();
  };
  useEffect(setError, [loading, errorCallback]);

  const panelContent = (
    <DrawerPanelContent defaultSize="600px" style={{ whiteSpace: 'pre-wrap' }}>
      <DrawerHead>
        <Title size="lg" headingLevel="h2">
          Policy data
        </Title>
        <DrawerActions>
          <DrawerCloseButton onClick={onClose} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody>
        <Flex
          spaceItems={{ default: 'spaceItemsLg' }}
          direction={{ default: 'column' }}
        >
          <FlexItem>
            <Form key={JSON.stringify(currentPolicy, null, 2)}>
              <FormGroup
                type="string"
                helperText={helperText}
                helperTextInvalid={helperText}
                fieldId="selection"
                validated={validated}
              >
                <TextArea
                  defaultValue={JSON.stringify(
                    removeId(currentPolicy),
                    null,
                    2
                  )}
                  onChange={onTextAreaChange}
                  isRequired
                  rows={15}
                  validated={validated}
                  aria-label="invalid text area example"
                />
                <Button variant="primary" onClick={editPolicy}>
                  Submit
                </Button>{' '}
                <Button variant="danger" onClick={deletePolicy}>
                  Delete
                </Button>
              </FormGroup>
            </Form>
          </FlexItem>
        </Flex>
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  const drawerContent = (
    <>
      <Toolbar id="data-list-data-toolbar" className="pf-m-page-insets">
        <ToolbarContent>
          <ToolbarItem>
            <Button variant="primary" onClick={handleModalToggle}>
              Create a Policy
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <DataList
        aria-label="selectable data list example"
        selectedDataListItemId={String(policyId)}
        onSelectDataListItem={onSelectDataListItem}
      >
        {policyPaginated.map((d: any) => (
          <DataListItem
            aria-label={`data-list-item-${String(d.id)}-in-card`}
            id={String(d.id)}
          >
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell>
                    <div>{d.name}</div>
                    <div>{d.department}</div>
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        ))}
      </DataList>
    </>
  );
  if (loading && !currentPolicy && !captureError) {
    return (
      <div>
        <h3>Loading...</h3>
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text
            component="h1"
            title="Create, remove, update, or delete policies."
          >
            Manage Policies
          </Text>
        </TextContent>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <Card>
          <Drawer isExpanded={isExpanded}>
            <DrawerContent panelContent={panelContent}>
              <DrawerContentBody>
                {drawerContent}
                {policyList.length === 0 ? (
                  <TextContent>
                    <Text>Sorry, no policies found.</Text>
                  </TextContent>
                ) : undefined}
              </DrawerContentBody>
            </DrawerContent>
          </Drawer>
        </Card>
        <Pagination
          itemCount={policyList.length}
          widgetId="pagination-options-menu-bottom"
          perPage={perPage}
          page={page}
          variant={PaginationVariant.bottom}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
        />

        <Modal
          title="Create Policy"
          isOpen={isModalOpen}
          onClose={handleModalToggle}
          actions={[
            <Button variant="primary" onClick={createPolicy}>
              Submit
            </Button>,
          ]}
        >
          <FormGroup
            type="string"
            helperText={helperText}
            helperTextInvalid={invalidText}
            fieldId="selection"
          >
            <TextArea
              onChange={onCreateChange}
              value={createValue}
              validated={validated}
              isRequired
              rows={15}
            />
          </FormGroup>
        </Modal>
      </PageSection>
    </>
  );
};

export default Policies;
