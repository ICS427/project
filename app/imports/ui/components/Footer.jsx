import React from 'react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = { paddingTop: '15px' };
    return (
        <footer className='footer'>
          <div style={divStyle} className="ui center aligned container">
            <p><strong>University of Hawaiʻi at Mānoa
              <script>document.write(new Date().getFullYear());</script></strong>
            </p>
            <address>
              2465 Campus Road, Room 208, Honolulu, HI 96822
              Phone:(808)956-8178 &nbsp;
              Email: <a href="mailto:sld@hawaii.edu">sld@hawaii.edu</a>
            </address>
          </div>
        </footer>
    );
  }
}

export default Footer;
