import React, { FC } from 'react';

interface Props {
  appName: string;
  buildVersion: string;
  buildCommit: string;
  newGrafanaVersionExists: boolean;
  newGrafanaVersion: string;
}

export const Footer: FC<Props> = React.memo(
  ({ appName, buildVersion, buildCommit, newGrafanaVersionExists, newGrafanaVersion }) => {
    return (
      <footer className="footer">
        <div className="text-center">
          <ul>
            <li>
              <a href="http://erp.htaviet.com:9397/" target="_blank">
                <i className="fa fa-support"></i>
                ERP HtaViet
              </a>
            </li>
          </ul>
        </div>
      </footer>
    );
  }
);

export default Footer;
