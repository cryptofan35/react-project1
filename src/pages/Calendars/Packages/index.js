import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getCalendarPackageAvailabilities } from "../../../appRedux/actions/Calendars";
import CalendarPackage from "../../../components/Calendars/Package";
import Page from "../../../components/Common/Page";
import { useFormatMessage } from 'react-intl-hooks';
import InfoIcon from '@2fd/ant-design-icons/lib/InformationOutline';
import './styles.less';
import { Pagination } from 'antd';

const PackagesCalendar = ({ packageAvailabilities, getCalendarPackageAvailabilities, property, loading, history }) => {

  const itemsPerPage = 10;
  const [sortedPackages, setSortedPackages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const t = useFormatMessage();

  useEffect(() => {
    if (property && property.objectId == null) {
      history.push('/property/add');
      return;
    }

    if (property && property.objectId) {
      getCalendarPackageAvailabilities(property.objectId, currentPageIndex);
    }
  }, [property, currentPageIndex]);

  useEffect(() => {
    if (packageAvailabilities) {
      const packagesList = [...packageAvailabilities].sort((a,b) => +b.id - +a.id);

      const startIndex = currentPageIndex * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageItems = packagesList.slice(startIndex, endIndex);

      setSortedPackages(pageItems);
    }
  }, [packageAvailabilities, ]);

  const onPageChange = page => {
    setCurrentPageIndex(page - 1);
  }

  return (
    <Page title={t({id: 'app.calendars.packages.packages_calendar'})}
    className="Packages">
      <div className={'info'}>
        <InfoIcon width={20} height={20}/>
        <p>{t({id: 'app.calendars.packages.info'})}</p>
      </div>
      {packageAvailabilities && property && property.objectId && sortedPackages && sortedPackages.map(({ id, name, reservedDates, roomID }) => (
        <CalendarPackage
          key={id}
          name={name}
          reservedDates={reservedDates ? reservedDates.filter(({ quantity = 0, isClosed }) => quantity && !isClosed) : []}
        />
      ))}
      {property && !property.objectId && <p>{t({id: 'app.calendars.packages.object_id_is_null'})}</p>}
      {!loading && packageAvailabilities && packageAvailabilities.length === 0 && <p>{t({id: 'app.calendars.packages.no_package'})}</p>}
      {loading && <p>{t({id: 'app.calendars.packages.loading_packages'})}</p>}

      {!loading && sortedPackages && sortedPackages.length > 0 &&
        <Pagination
          defaultCurrent={1}
          current={currentPageIndex + 1}
          onChange={page => onPageChange(page)}
          pageSize={itemsPerPage}
          total={packageAvailabilities.length}
          showSizeChanger={false}
        />
      }

    </Page>
  )
}

const mapStateToProps = ({ calendars, property: propertyState }) => {
  const { packageAvailabilities, loading } = calendars;
  const { property } = propertyState;

  return {
    packageAvailabilities,
    property,
    loading
  };
};

const mapDispatchToProps = {
  getCalendarPackageAvailabilities
}


export default connect(mapStateToProps, mapDispatchToProps)(PackagesCalendar);
