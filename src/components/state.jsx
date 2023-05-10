import React from 'react';

export default function TheState(props) {
    var state = props.state;//loading error warning
    var title = props.title;
    var message = props.message;
    return (
        <div>
            {title}
        </div>
    );
}