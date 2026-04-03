import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import scss from './styles/Dashboard.module.scss';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { signOut, getSession } from 'next-auth/react';
import interactionPlugin from '@fullcalendar/interaction';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Session, PageProps } from '@/controllers/layouts/types/cms_types';

const Dashboard_V = () => {
  const [mounted, setMounted] = useState(false);
  const [calendarHeight, setCalendarHeight] = useState(500);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 800) {
        setCalendarHeight(400); // mobile → scroll
      }
    };

    handleResize(); // run on mount
    setMounted(true);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
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
              <button className={scss.createBtn}>
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
              <div className={scss.box}>

              </div>
              <div className={scss.box}>

              </div>
              <div className={scss.box}>

              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (!session?.user) {
    signOut({ redirect: true, callbackUrl: '/' })
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