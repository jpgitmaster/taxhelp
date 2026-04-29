import { Modal, DatePicker } from 'antd';
import { getSession } from 'next-auth/react';
import FullCalendar from '@fullcalendar/react';
import scss from './styles/Dashboard.module.scss';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Loader from '@/components/reusables/RotatingLoader';
import { initDashboard } from '@/controllers/dashboard/states';
import useDashboard from '@/controllers/dashboard/useDashboard';
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
    status,
    mounted,
    dashboard,
    clientArr,
    isModalOpen,
    clientLoader,
    displayClients,
    calendarHeight,
    displayCategory,

    // SET STATES
    setDoc,
    setDashboard,
    setDisplayClients,
    setDisplayCategory,
    
    // HANDLES
    handleDate,
    handleBlur,
    handleToggle,
    handleSubmit,
    handleChange,
    handleResubmit,
    handleOpenModal,
    handleCloseModal,
    handleSelectClient,
    handleSelectCategory,
  } = useDashboard()
  const { loader } = status
  return (
      <div className={scss.dashboardWrapper}>
        <div className={scss.contentArea}>
          {/* STATS */}
          <div className={scss.statsGrid}>
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
          </div>
          <div className={scss.scheduleWrapper}>
            {/* UPCOMING SCHEDULES */}
            <div className={scss.upcomingList}>
              <button className={scss.createBtn} onClick={handleOpenModal}>
                + Create Schedule
              </button>
              <h3>Upcoming Schedules</h3>
              <ul>
                <li>Accounts Payable - 30 Mar 2026</li>
                <li>Meeting - 2 Apr 2026</li>
                <li>Filing & Documentation - 23 Apr 2026</li>
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
                    events={[
                      { title: 'Accounts Payable', date: '2026-03-30' },
                      { title: 'Meeting', date: '2026-04-02' },
                      { title: 'Filing & Documentation', date: '2026-04-23' },
                    ]}
                    editable={true}
                    selectable={true}
                    contentHeight={calendarHeight}
                  />
                </div>
              </div>
            }
            <div className={scss.scheduleBox}>
              ADVERTISEMENTS
              <div className={scss.box}>

              </div>
              <div className={scss.box}>

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
                  value: '',
                  label: '',
                  color: ''
                }
              })
              setDashboard(initDashboard)
          }}
        >
          <div className={scss.addSchedule}>
            <h3 className={scss.addSchedLbl}>
              Add Schedule
            </h3>
            <form onSubmit={handleSubmit}>
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
                  {/* <DatePicker
                    // onChange={handleDate}
                    // value={dashboard.scheduleObj.schedule}
                    style={{ border: dashboard.scheduleErr.schedule ? '1px solid #F00' : '1px solid #D9D9D9' }}
                  /> */}
                  <RangePicker suffixIcon={''}
                    onChange={handleDate}
                    value={dashboard.scheduleObj.schedule}
                    style={{ border: dashboard.scheduleErr.schedule ? '1px solid #F00' : '1px solid #D9D9D9' }}
                  />
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={50}
                  required={true}
                  label='Category'
                  labelFor='category'
                  err={dashboard.scheduleErr.category as string}
                >
                  <ScheduleCategoryDropdown
                    doc={doc}
                    options={[
                      {
                        label: 'Holidays',
                        value: '',
                        color: '#0077c0',
                      },
                      {
                        label: 'Client Schedule',
                        value: '',
                        color: '#14b11c',
                      },
                      {
                        label: 'Deadlines',
                        value: '',
                        color: '#f00',
                      }
                    ]}
                    displayCategory={displayCategory}
                    err={dashboard.scheduleErr.category ? true : false}
                    setDisplayCategory={setDisplayCategory}

                    handleToggle={handleToggle}
                    handleSelectCategory={handleSelectCategory}
                  />
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={100}
                  label='Client'
                  labelFor='client'
                  err={dashboard.scheduleObj.client as string}
                >
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
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={100}
                  label='Description'
                  labelFor='description'
                  err={dashboard.scheduleErr.description as string}
                >
                  <textarea
                    id='description'
                    name='description'
                    value={dashboard.scheduleObj.description}
                    onKeyUp={handleBlur}
                    onChange={handleChange}
                  />
                </CustomContainer>
              </div>
              <button type='submit' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '-10px auto 30px'}} onKeyDown={handleResubmit}>
                Save Schedule
              </button>
            </form>
          </div>
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