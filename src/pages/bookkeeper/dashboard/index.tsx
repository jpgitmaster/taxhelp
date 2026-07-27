import dayjs from 'dayjs';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import FullCalendar from '@fullcalendar/react';
import scss from './styles/Dashboard.module.scss';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Loader from '@/components/reusables/RotatingLoader';
import { Modal, DatePicker, Popconfirm, Rate } from 'antd';
import { initDashboard } from '@/controllers/dashboard/states';
import useDashboard from '@/controllers/dashboard/useDashboard';
import SuccessMessage from '@/components/reusables/SuccessMessage';
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Session, PageProps } from '@/controllers/layouts/types/cms_types';
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import ScheduleCategoryDropdown from '@/components/pages/bookkeeper/dashboard/ScheduleCategoryDropdown';

const { RangePicker } = DatePicker;

const Dashboard_V = () => {
  const {
    // STATES
    doc,
    user,
    events,
    status,
    mounted,
    dashboard,
    clientArr,
    isEditMode,
    isModalOpen,
    clientLoader,
    selectedReport,
    categoryLoader,
    displayClients,
    calendarHeight,
    schedCategories,
    displayCategory,
    isReportModalOpen,

    // SET STATES
    setDoc,
    setIsEditMode,
    setDashboard,
    openEventModal,
    setDisplayClients,
    setDisplayCategory,
    setIsReportModalOpen,
    
    // HANDLES
    handleDate,
    handleBlur,
    handleToggle,
    handleSubmit,
    handleChange,
    handleResubmit,
    handleOpenModal,
    handleCloseModal,
    handleEventClick,
    handleOpenReport,
    handleSelectClient,
    handleDeleteRecord,
    handleSelectCategory,
  } = useDashboard()
  const { message, loader } = status
  const selectedText =
    (doc.client.registered_name || '') ||
    (doc.client.first_name
        ? `${doc.client.first_name} ${doc.client.last_name}`
        : '');

    const displayText = selectedText +
    (doc.client.trade_name ? ` - ${doc.client.trade_name}` : '');
  const isPro = user?.subscription?.plan === 'pro'
  return (
      <div className={scss.dashboardWrapper}>
        <div className={scss.heroBanner}>
          <div className={scss.left}>
              <span className={scss.badge}>
                  📊 System Dashboard
              </span>

              <h1>Manage Schedules, Reports & User Feedback in One Place</h1>

              <p>
                  Your central control panel for monitoring activities, managing
                  calendar schedules, tracking system issues, and reviewing user
                  feedback in real time.
              </p>

              <div className={scss.features}>
                  <span>
                      <Image
                          src="/svgs/check.svg"
                          alt="Check"
                          width={22}
                          height={22}
                          unoptimized
                          className={scss.check}
                      />
                      Smart Calendar Scheduling
                  </span>

                  <span>
                      <Image
                          src="/svgs/check.svg"
                          alt="Check"
                          width={22}
                          height={22}
                          unoptimized
                          className={scss.check}
                      />
                      Bug & Issue Reporting
                  </span>

                  <span>
                      <Image
                          src="/svgs/check.svg"
                          alt="Check"
                          width={22}
                          height={22}
                          unoptimized
                          className={scss.check}
                      />
                      User Feedback Monitoring
                  </span>
              </div>
          </div>

          <div className={scss.right}>
            <div className={scss.imageContainer}>
              <Image src='/images/taxhelp_image_.JPG' alt="Manage Schedules, Reports & User Feedback in One Place" width={400} height={200} />
            </div>
          </div>
      </div>
      
        {
          message &&
          <SuccessMessage message={message} />
        }
        <div className={scss.contentArea}>
          {/* STATS */}
          {/* <div className={scss.statsGrid}>
            <div className={scss.card}>
              <p>Total Events</p>
              <h2>12</h2>
            </div>
            <div className={scss.card}>
              <p>Upcoming</p>
              <h2>5</h2>
            </div>
            <div className={scss.card}>
              <p>Completed</p>
              <h2>7</h2>
            </div>
          </div> */}
          <div className={scss.scheduleWrapper}>
            {/* UPCOMING SCHEDULES */}
            <div className={scss.upcomingList}>
              <button className={scss.button+' '+scss.btnorange} onClick={() => {
                handleOpenModal()
              }}>
                + Create Schedule
              </button>
              <h3>Upcoming Schedules</h3>
              <ul>
                {
                  events.map((event: {
                    id: number
                    end: string
                    title: string
                    start: string
                    backgroundColor: string
                  }) =>
                    <li key={event.id} onClick={() => openEventModal(event)}>
                      <div  style={{backgroundColor: event.backgroundColor}} className={scss.categoryColor}></div>
                      <div>
                        <strong>
                          {event.title}
                        </strong>
                        <p>
                          {event.start === event.end ? dayjs(event.start).format('MMMMM DD, YYYY') : dayjs(event.start).format('MMMM DD, YYYY')+' - '+dayjs(event.end).format('MMMM DD, YYYY')}
                        </p>
                      </div>
                    </li>
                  )
                }
                {/* <li>Accounts Payable - 30 Mar 2026</li>
                <li>Meeting - 2 Apr 2026</li>
                <li>Filing & Documentation - 23 Apr 2026</li> */}
              </ul>
            </div>
            {/* CALENDAR */}
            {
              mounted &&
              <div className={scss.calendarContainer}>
                <div className={scss.calender}>
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    editable={true}
                    selectable={true}
                    eventClick={handleEventClick}
                    contentHeight={calendarHeight}
                  />
                  {
                    schedCategories?.length ?
                    <div className={scss.legends}>
                      <strong>Legends:</strong>
                      <ul>
                        {schedCategories?.map((category: { id: number,  name: string, color: string }) =>
                          <li key={category.id}>
                            <div  style={{backgroundColor: category.color}} className={scss.categoryColor}></div>
                            {category.name}
                          </li>
                        )}
                      </ul>
                    </div>
                    : null
                  }
                </div>
              </div>
            }
            <div className={scss.scheduleBox}>
              <div className={scss.feedbackActions}>
                <button className={scss.button+' '+scss.btnblue}
                  onClick={() =>
                    handleOpenReport({
                      name: 'Juan Dela Cruz',
                      email: 'juan@example.com',
                      description: 'The dashboard chart fails to load.',
                      images: ['https://example.com/screenshot.png'],
                      review_type: 'feedback',
                    })
                  }
                >
                  Add Feedback
                </button>
                <button
                  className={scss.button + ' ' + scss.btnorange}
                  onClick={() =>
                    handleOpenReport({
                      name: 'Juan Dela Cruz',
                      email: 'juan@example.com',
                      description: 'The dashboard chart fails to load.',
                      images: ['https://example.com/screenshot.png'],
                      review_type: 'bug',
                    })
                  }
                >
                  Report a bug
                </button>
              </div>
              <div className={scss.boxWrapper}>
                <div className={scss.box}>

                </div>
              </div>
              <div className={scss.boxWrapper}>
                <div className={scss.box}>

                </div>
              </div>
              <div className={scss.boxWrapper}>
                <div className={scss.box}>

                </div>
              </div>
              <div className={scss.box}>

              </div>
            </div>
          </div>
        </div>
        <Modal
          footer={null}
          open={isModalOpen}
          onCancel={() => {
              handleCloseModal()
              setDoc({
                ...doc,
                selectedCategory: {
                  id: null,
                  name: '',
                  color: ''
                }
              })
              setDashboard(initDashboard)
          }}
        >
          <div className={scss.addSchedule}>
            <h3 className={scss.addSchedLbl}>
              {!dashboard.scheduleObj.id ? 'Add' : isEditMode ? 'Edit' : 'View'}  Schedule
            </h3>
            {
              dashboard.scheduleObj.id &&
              <div className={scss.actions}>
                {
                  !isEditMode ?
                  <button type='button' className={scss.action+' '+scss.edit}
                    onClick={() => setIsEditMode(true)}
                  >
                      <Image src='/svgs/edit.svg' alt='Edit' priority width={20} height={20} unoptimized={true} />
                      <span>
                          Edit
                      </span>
                  </button>
                  :
                  <button type='button' className={scss.action+' '+scss.edit}
                    onClick={() => setIsEditMode(false)}
                  >
                      <Image src='/svgs/eyecon_check.svg' alt='View' priority width={20} height={20} unoptimized={true} />
                      <span>
                          View
                      </span>
                  </button>
                }
                <Popconfirm
                  title="Delete the record"
                  description="Are you sure to delete this schedule?"
                  onConfirm={() => handleDeleteRecord(Number(dashboard.scheduleObj.id))}
                  // onCancel={() => handleToggleDelete(Number(record.id))}
                  okText="Yes"
                  cancelText="No"
                >
                  <button type='button'
                    // onClick={() => handleToggleDelete(Number(record.id))}
                    className={scss.action+' '+scss.delete}>
                      <Image src='/svgs/delete.svg' alt='Delete' priority width={18} height={18} unoptimized={true} />
                      <span>
                          Delete
                      </span>
                  </button>
                </Popconfirm>
              </div>
            }
            <form onSubmit={handleSubmit} className={scss.schedForm}>
              { loader && <Loader scss={scss} position='absolute' />}
              <div className={scss.cards}>
                <CustomContainer
                  scss={scss}
                  width={100}
                  required={true}
                  label='Title'
                  labelFor='title'
                  err={dashboard.scheduleErr.title as string}
                >
                  <input
                    type='text'
                    id='title'
                    name='title'
                    value={dashboard.scheduleObj.title}
                    readOnly={(dashboard.scheduleObj.id && !isEditMode) ? true : false}
                    className={(dashboard.scheduleObj.id && !isEditMode) ? scss.lblContent : ''}
                    onKeyUp={handleBlur}
                    onChange={handleChange}
                  />
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={50}
                  required={true}
                  label='Schedule'
                  labelFor='schedule'
                  err={dashboard.scheduleErr.schedule as string}
                >
                  {
                    (dashboard.scheduleObj.id && !isEditMode) ? (
                      <input
                        type='text'
                        id='schedule'
                        name='schedule'
                        value={
                          dashboard.scheduleObj.schedule?.[0]?.format('MM/DD/YYYY') +
                          ' - ' +
                          dashboard.scheduleObj.schedule?.[1]?.format('MM/DD/YYYY')
                        }
                        readOnly={true}
                        className={scss.lblContent}
                      />
                    ) : isPro ? (
                      <RangePicker
                        suffixIcon={''}
                        onChange={handleDate}
                        value={dashboard.scheduleObj.schedule}
                        disabledDate={(current) => {
                          return current && current < dayjs().startOf('day');
                        }}
                        style={{
                          border: dashboard.scheduleErr.schedule
                            ? '1px solid #F00'
                            : '1px solid #D9D9D9',
                          margin: 0
                        }}
                      />
                    ) : (
                      <DatePicker
                        suffixIcon={''}
                        onChange={(date) => {
                          handleDate([date, date])
                        }}
                        value={dashboard.scheduleObj.schedule?.[0]}
                        disabledDate={(current) => {
                          return current && current < dayjs().startOf('day');
                        }}
                        style={{
                          width: '100%',
                          border: dashboard.scheduleErr.schedule
                            ? '1px solid #F00'
                            : '1px solid #D9D9D9',
                          margin: 0
                        }}
                      />
                    )
                  }
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={50}
                  required={true}
                  label='Category'
                  labelFor='category'
                  err={dashboard.scheduleErr.category as string}
                >
                  {
                    (dashboard.scheduleObj.id && !isEditMode) ?
                    <>
                      <div style={{
                          backgroundColor: doc.selectedCategory.color,
                          height: '10px', width: '10px',
                          borderRadius: '50%', position: 'absolute',
                          right: 0, top: '15px'
                      }}></div>
                      <input
                        type='text'
                        id='category'
                        name='category'
                        value={doc.selectedCategory.name}
                        readOnly={dashboard.scheduleObj.id ? true : false}
                        className={dashboard.scheduleObj.id ? scss.lblContent : ''}
                      />
                    </>
                    :
                    <ScheduleCategoryDropdown
                      doc={doc}
                      categoryLoader={categoryLoader}
                      displayCategory={displayCategory}
                      schedCategories={schedCategories}
                      err={dashboard.scheduleErr.category ? true : false}
                      setDisplayCategory={setDisplayCategory}

                      handleToggle={handleToggle}
                      handleSelectCategory={handleSelectCategory}
                    />
                  }
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={100}
                  label='Client'
                  labelFor='client'
                  err={dashboard.scheduleErr.client as string}
                >
                  {
                    (dashboard.scheduleObj.id && !isEditMode) ?
                      <input
                        id='client'
                        type='text'
                        value={displayText}
                        readOnly={dashboard.scheduleObj.id ? true : false}
                        className={dashboard.scheduleObj.id ? scss.lblContent : ''}
                      />
                      :
                      <ClientsDropdown
                        doc={doc}
                        clients={clientArr}
                        loader={clientLoader}
                        displayClients={displayClients}
                        setDisplayClients={setDisplayClients}

                        handleChange={handleChange}
                        handleToggle={handleToggle}
                        handleSelectClient={handleSelectClient}
                      />
                  }
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={100}
                  label='Agenda'
                  labelFor='description'
                  err={dashboard.scheduleErr.description as string}
                >
                  {
                    (dashboard.scheduleObj.id && !isEditMode) ?
                    <textarea
                      id='description'
                      name='description'
                      style={{minHeight: '100px'}}
                      value={dashboard.scheduleObj.description}
                      readOnly={dashboard.scheduleObj.id ? true : false}
                      className={dashboard.scheduleObj.id ? scss.lblContent : ''}
                    />
                    :
                    <textarea
                      id='description'
                      name='description'
                      maxLength={1000}
                      style={{minHeight: '100px'}}
                      value={dashboard.scheduleObj.description}
                      onKeyUp={handleBlur}
                      onChange={handleChange}
                    />
                  }
                </CustomContainer>
              </div>
              {
                
                (!dashboard.scheduleObj.id || isEditMode) &&
                <button type='submit' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '-10px auto 30px'}} onKeyDown={handleResubmit}>
                  Save Schedule
                </button>
              }
            </form>
          </div>
        </Modal>
        <Modal
          open={isReportModalOpen}
          footer={null}
          onCancel={() => setIsReportModalOpen(false)}
        >
          <div className={scss.addSchedule}>
            <h3 className={scss.addSchedLbl}>
              {selectedReport.review_type === 'bug'
              ? 'Bug Report'
              : 'Add Feedback'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className={scss.schedForm}>
            { loader && <Loader scss={scss} position='absolute' />}
            <div className={scss.cards}>
              {
                selectedReport.review_type === 'feedback' &&
                <CustomContainer
                  scss={scss}
                  width={100}
                  label='Rate'
                >
                  <Rate />
                </CustomContainer>
              }
              {
                selectedReport.review_type === 'bug' &&
                <div className={scss.customFile+' '+scss.card+' '+scss.w100}>
                  <div className={scss.customFileUpload}>
                      <label className={scss.customFile}>
                          <input
                              name="file"
                              type="file"
                              // onChange={handleFileChange}
                          />
                          <div className={scss.empty_image}>
                              <Image
                                  src="/svgs/reports.svg"
                                  alt="Empty Image"
                                  width={26}
                                  height={26}
                                  unoptimized
                              />
                          </div>
                          <>
                              <p>Browse or upload your file here</p>
                              <span>
                                  Supported formats: .jpg, .png<br />
                                  Maximum file size: 5 MB
                              </span>
                          </>
                      </label>
                  </div>
                </div>
              }
              <CustomContainer
                scss={scss}
                width={100}
                required={true}
                label={selectedReport.review_type === 'bug'
                  ? 'Bug Description'
                  : 'Feedback'}
                labelFor='description'
                err={dashboard.scheduleErr.title as string}
              >
                <textarea
                  id='description'
                  name='description'
                  maxLength={1000}
                  style={{minHeight: '100px'}}
                  value={dashboard.scheduleObj.description}
                  onKeyUp={handleBlur}
                  onChange={handleChange}
                />
              </CustomContainer>
            </div>
            <button type='submit' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '-10px auto 30px'}} onKeyDown={handleResubmit}>
              Submit {selectedReport.review_type === 'bug'
                  ? 'Bug Report'
                  : 'Feedback'}
            </button>
          </form>
        </Modal>
      </div>
  )
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (!session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}
export default Dashboard_V;