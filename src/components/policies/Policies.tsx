import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
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
  Modal,
  PageSection,
  PageSectionVariants,
  Pagination,
  PaginationVariant,
  Spinner,
  Text,
  TextContent,
} from '@patternfly/react-core';

import {
  loadRequest as loadPolicy,
  createRequest,
  deleteRequest,
  updateRequest,
} from '@ducks/lab/policy/actions';
import { loadRequest as loadLocation } from '@ducks/lab/location/actions';

import { SubmitPolicyData } from '@ducks/lab/policy/types';

import { AppState } from '@store';

import PolicyForm, { PolicyFormData } from './PolicyForm';
import { getDefaultFormValues, getSubmitData } from './helpers';

const Policies: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.user.current.token);

  const policyStore = useSelector((state: AppState) => state.labPolicy.data);
  const errMsg = useSelector((state: AppState) => state.labPolicy.errMsg);
  const loading = useSelector(
    (state: AppState) => state.labPolicy.loading || state.labLocation.loading
  );
  const error = useSelector((state: AppState) => state.labPolicy.error);
  const locations = useSelector((state: AppState) => state.labLocation.data);
  const [policyId, setPolicyId] = useState<number | undefined>(undefined);
  const [captureError, setCaptureError] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [defaultValues, setDefaultValues] = useState<PolicyFormData>();
  const queryPolicy = (): void => {
    dispatch(loadPolicy('all'));
    dispatch(loadLocation('all'));
  };
  useEffect(queryPolicy, [dispatch, token]);
  useEffect(() => {
    if (policyId) {
      const currentPolicy = policyStore[policyId];
      setDefaultValues(getDefaultFormValues(currentPolicy));
    }
  }, [policyId, policyStore]);
  const policyList = Object.values(policyStore);
  const policyPaginated = policyList.slice(
    page * perPage - perPage,
    page * perPage
  );
  // API actions
  const createPolicy = (value: SubmitPolicyData): void => {
    setCaptureError(true);

    try {
      dispatch(createRequest(value));
    } catch (e) {
      if ((e as any).name === 'SyntaxError') {
        setCaptureError(false);
      }
    }
  };

  const editPolicy = (value: SubmitPolicyData): void => {
    setCaptureError(true);

    try {
      dispatch(updateRequest(Number(policyId), value));
    } catch (e) {
      if ((e as any).name === 'SyntaxError') {
        setCaptureError(false);
      }
    }
  };

  const deletePolicy = (): void => {
    if (policyId) {
      setCaptureError(true);
      dispatch(deleteRequest(policyId));
    }
  };

  const handleModalToggle = React.useCallback(() => {
    setIsCreateModalOpen(!isCreateModalOpen);
  }, [isCreateModalOpen]);

  const handleEditModalToggle = React.useCallback(() => {
    setIsEditModalOpen(!isEditModalOpen);
  }, [isEditModalOpen]);

  const onSetPage = (_event: any, pageNumber: number) => {
    setPolicyId(undefined);
    setPage(pageNumber);
  };

  const onPerPageSelect = (_event: any, newPerPage: number) => {
    setPerPage(newPerPage);
  };

  const onSelectDataListItem = (id: string) => {
    setPolicyId(Number(id));
    dispatch(loadPolicy(Number(id)));
    setIsEditModalOpen(true);
  };

  const errorCallback = React.useCallback(() => {
    if (policyPaginated.length === 0 && page > 1) {
      setPage(page - 1);
    }
    if (captureError) {
      if (loading === false) {
        if (error === true) {
          if (isCreateModalOpen) {
            handleModalToggle();
          } else if (isEditModalOpen) {
            handleEditModalToggle();
          }

          setPolicyId(undefined);
        }
        setCaptureError(false);
      }
    }
  }, [
    captureError,
    error,
    handleModalToggle,
    isCreateModalOpen,
    handleEditModalToggle,
    isEditModalOpen,
    loading,
    page,
    policyPaginated,
  ]);

  const setError = (): void => {
    errorCallback();
  };
  useEffect(setError, [loading, errorCallback]);

  const onCreateSubmit = (formData: PolicyFormData) => {
    createPolicy(getSubmitData(formData));
    setIsCreateModalOpen(false);
  };

  const onEditSubmit = (formData: PolicyFormData) => {
    editPolicy(getSubmitData(formData));
    setIsEditModalOpen(false);
  };

  if (loading || (!policyStore[Number(policyId)] && !locations)) {
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
                key={`policy-${String(d.id)}`}
              >
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key={`cell-${String(d.id)}`}>
                        <div>{d.name}</div>
                        <div>{d.department}</div>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            ))}
          </DataList>
          {policyList.length === 0 ? (
            <TextContent>
              <Text>Sorry, no policies found.</Text>
            </TextContent>
          ) : undefined}
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

        {!loading && policyStore[Number(policyId)] && (
          <Modal
            title="Edit Policy"
            isOpen={isEditModalOpen}
            onClose={handleEditModalToggle}
            variant="medium"
            actions={[
              <Button
                variant="primary"
                form="edit-policy-form"
                key="submit"
                onClick={() => {
                  const form = document.getElementById('edit-policy-form');

                  if (form !== null) {
                    form.dispatchEvent(new Event('submit'));
                  }
                }}
              >
                Submit
              </Button>,
              <Button
                variant="danger"
                key="delete"
                onClick={() => {
                  deletePolicy();
                  handleEditModalToggle();
                }}
              >
                Delete
              </Button>,
              <Button
                variant="link"
                key="cancel"
                onClick={handleEditModalToggle}
              >
                Cancel
              </Button>,
            ]}
          >
            <PolicyForm
              onSubmit={onEditSubmit}
              type="edit"
              locations={locations}
              defaultValues={defaultValues}
            />
          </Modal>
        )}

        <Modal
          title="Create Policy"
          isOpen={isCreateModalOpen}
          onClose={handleModalToggle}
          variant="medium"
          actions={[
            <Button
              variant="primary"
              form="create-policy-form"
              key="submit"
              onClick={() => {
                const form = document.getElementById('create-policy-form');

                if (form !== null) {
                  form.dispatchEvent(new Event('submit'));
                }
              }}
            >
              Submit
            </Button>,
            <Button variant="link" key="cancel" onClick={handleModalToggle}>
              Cancel
            </Button>,
          ]}
        >
          <PolicyForm
            onSubmit={onCreateSubmit}
            type="create"
            locations={locations}
          />
        </Modal>
      </PageSection>
    </>
  );
};

export default Policies;
