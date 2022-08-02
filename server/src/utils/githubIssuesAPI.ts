import fetch from 'node-fetch';
import { GithubPersonnalToken, GithubRepo, GithubUser } from './variables';

/**
 * The following functions use the Github REST Issues API
 * to link the Bug Tracker with Github Issues
 * To learn more see the official documentation:
 * https://docs.github.com/en/rest/issues/issues
 */

let id: number;

/**
 *  This function creates an issue in Github Issues 
 *  whenever a bug is added on the Bug Tracker.
 *  To learn more see the official documentation:
 *  https://docs.github.com/en/rest/issues/issues#create-an-issue
 */
const createGitIssues = async (title: string, body: string) => {
    const JSON_DATA = {
        title: `${title}`,
        body: `${body}`,
        labels: [
            "bug"
        ]
    };

    await fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues`, {
        method: 'post',
        body:    JSON.stringify(JSON_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res => res.json())
        .then(res =>
            id = res.number
        )

   return id;
}

/**
 *  This function updates an issue in Github Issues 
 *  whenever a bug is updated on the Bug Tracker.
 *  To learn more see the official documentation:
 *  https://docs.github.com/en/rest/issues/issues#update-an-issue
 */
const updateGitIssues = (title: string, body: string, ISSUE_NUMBER: number) => {
    const JSON_DATA = {
        title: `${title}`,
        body: `${body}`,
        labels: [
            "bug"
        ]
    };

    fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}`, {
        method: 'patch',
        body:    JSON.stringify(JSON_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
}

/**
 *  This function closes an issue in Github Issues 
 *  whenever a bug is closed on the Bug Tracker.
 *  To learn more see the official documentation:
 *  https://docs.github.com/en/rest/issues/issues#update-an-issue
 *  https://docs.github.com/en/rest/issues/issues#lock-an-issue
 */
const closeGitIssues = (ISSUE_NUMBER: number) => {
    // First API Call to lock the issue conversation
    const JSON_LOCK_DATA = {
        lock_reason : 'resolved'
    };

    fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}/lock`, {
        method:  'put',
        body:   JSON.stringify(JSON_LOCK_DATA),
        headers: {'Accept': 'application/vnd.github+json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
    .then(function(res) {
        return res.text()
    })

    // Second API Call to close the issue
    const JSON_CLOSE_DATA = {
        state: 'closed'
    };

    fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}`, {
        method: 'patch',
        body:    JSON.stringify(JSON_CLOSE_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
}

/**
 *  This function re-opens an issue in Github Issues 
 *  whenever a bug is re-opened on the Bug Tracker.
 *  To learn more see the official documentation:
 *  https://docs.github.com/en/rest/issues/issues#update-an-issue
 *  https://docs.github.com/en/rest/issues/issues#unlock-an-issue
 */
const reopenGitIssues = (ISSUE_NUMBER: number) => {
    // First API Call to unlock the issue conversation
    fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}/lock`, {
        method: 'delete',
        headers: {'Content-Type': 'application/vnd.github+json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
        .then(res => console.log(res))
    
    // Second API Call to re-open the issue
    const JSON_OPEN_DATA = {
        state: 'open'
    };

    fetch(`https://api.github.com/repos/${GithubUser}/${GithubRepo}/issues/${ISSUE_NUMBER}`, {
        method: 'patch',
        body:    JSON.stringify(JSON_OPEN_DATA),
        headers: {'Content-Type': 'application/json', 'Authorization': `token ${GithubPersonnalToken}`}
    })
        .then(res =>  res.json())
}

export { createGitIssues };
export { updateGitIssues };
export { closeGitIssues };
export { reopenGitIssues };