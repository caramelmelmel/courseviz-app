import React, { useState, useEffect, useRef } from 'react';
import { Container } from '@material-ui/core';
import XocesWidget from '../components/XocesWidget';
import services from "../services";

const Dashboard: React.FC = ({}) => {
  const [key, setKey] = useState<number>(Date.now());
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [mos, setMos] = useState<MO[]>([]);
  const [moLinks, setMoLinks] = useState<MOLink[]>([]);

  useEffect(() => {
    (async () => {
      const [pillars, perr] = await services.pillars.readAll();
      if (perr == null  && pillars != null) { setPillars(pillars); }

      const [courses, cerr] = await services.courses.readAll();
      if (cerr == null  && courses != null) { setCourses(courses); }

      const [mos, merr] = await services.outcomes.readAll();
      if (merr == null  && mos != null) { setMos(mos); }

      const [mosLines, mlerr] = await services.links.readAll();
      if (mlerr == null  && mosLines != null) { setMoLinks(mosLines); }

      setKey(Date.now());
    })();
  }, []);

    return (
        <Container>
            <XocesWidget
                pillars={pillars}
                courses={courses}
                mos={mos}
                moLinks={moLinks}
                key={key}
            />
        </Container>
    )
}

export default Dashboard
