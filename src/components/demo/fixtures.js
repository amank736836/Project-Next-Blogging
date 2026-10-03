/**
 * Fixture content for /demo — the design preview route.
 * Nothing here touches MongoDB; it exists so the archive, card and article
 * layouts can be reviewed without a database attached.
 */
export const DEMO_POSTS = [
  {
    slug: 'morning-the-fog-lifted',
    title: 'The morning the fog lifted, I finally wrote it down',
    featuredImage: '/demo/fog-lake.jpg',
    status: 'active',
    createdAt: '2026-09-28T06:41:00.000Z',
    content: `
      <p>There is a particular hour on a cold lake when the water stops being water and becomes a
      surface waiting for a sentence. I had been carrying this one for three weeks, and it
      arrived, as these things do, completely without ceremony.</p>
      <h2>What the fog teaches about beginnings</h2>
      <p>You cannot write the middle of a fog. You can only write the edges — the ridge that appears
      first, the reeds that stay visible, the sound of something moving where you cannot see. It
      turns out that is a decent method for paragraphs too.</p>
      <blockquote>A photograph keeps a moment. A sentence keeps why it mattered.</blockquote>
      <p>By seven the light had flattened everything into the same soft grey, and the picture I had
      planned to take no longer existed. I took the one in front of me instead.</p>
      <ul>
        <li>Arrive forty minutes before the sun does</li>
        <li>Write down the first sentence, even a bad one</li>
        <li>Keep the frame honest and the paragraph shorter than feels right</li>
      </ul>
      <h3>The part nobody tells you</h3>
      <p>The lake does this every morning. The only variable is whether you are standing there with
      a notebook open, and that is the entire difference between a memory and a piece of writing.</p>
    `,
  },
  {
    slug: 'rain-window-august',
    title: 'Notes from a rain-streaked window in August',
    featuredImage: '/demo/rain-window.jpg',
    status: 'active',
    createdAt: '2026-08-19T21:12:00.000Z',
    content: `
      <p>The city does something generous in the rain: it stops asking to be photographed and
      starts asking to be remembered.</p>
      <h2>A short inventory of small things</h2>
      <p>Water finding the one flaw in a window. A kettle at a distance. The specific amber of a
      streetlight behind beaded glass, which no white balance will ever agree with.</p>
      <blockquote>The best captions are ingredients lists, not interpretations.</blockquote>
      <p>I wrote seven of them that night and kept two. That ratio has not improved in years, and I
      have stopped expecting it to.</p>
    `,
  },
  {
    slug: 'dunes-at-golden-hour',
    title: 'Long shadows, one ridge, and the case for standing still',
    featuredImage: '/demo/dunes.jpg',
    status: 'active',
    createdAt: '2026-07-04T18:05:00.000Z',
    content: `
      <p>Deserts are the most honest studio in the world. There is one line of interest, and it is
      always somewhere you have not walked to yet.</p>
      <h2>The ridge line problem</h2>
      <p>Every dune photograph is really a photograph of a decision: shoot into the light and lose
      the texture, or turn your back on it and lose the mood. The trick — I am told, and have only
      managed twice — is to find the crest that gives you both.</p>
      <ul>
        <li>Sand at golden hour is a gradient, not a colour</li>
        <li>Footprints are the fastest way to ruin a frame</li>
        <li>Stand still long enough and the shadow does the composing</li>
      </ul>
      <p>Then put the camera down and write what the heat felt like, because the sensor will not
      remember that part.</p>
    `,
  },
  {
    slug: 'draft-essays-worth-keeping',
    title: 'Drafts worth keeping: the shelf nobody sees',
    featuredImage: '/demo/dunes.jpg',
    status: 'inactive',
    createdAt: '2026-06-15T11:30:00.000Z',
    content: `<p>An unfinished note that stays on the shelf until the ending shows up.</p>`,
  },
  {
    slug: 'blue-hour-kitchen',
    title: 'Blue hour in an unfamiliar kitchen',
    featuredImage: '/demo/rain-window.jpg',
    status: 'active',
    createdAt: '2026-05-30T19:45:00.000Z',
    content: `
      <p>Every kitchen has one window worth a photograph and one counter that catches the last light
      of the day at an angle you notice too late.</p>
      <h2>Ten minutes of usable light</h2>
      <p>Blue hour is generous for exactly as long as it is devastating. Set the frame, then write
      while the colour drains out of it.</p>
    `,
  },
  {
    slug: 'the-caption-problem',
    title: 'The caption problem: when a sentence is one sentence too many',
    featuredImage: '/demo/fog-lake.jpg',
    status: 'active',
    createdAt: '2026-04-02T08:15:00.000Z',
    content: `
      <p>A good caption is a hand on the shoulder, not a mouth against the ear. It points, then
      steps back.</p>
      <h2>Three tests before you publish</h2>
      <p>Read it aloud. Delete the first clause. Ask whether the photo still works without it — if
      the answer is no, the caption was doing the photography's job.</p>
    `,
  },
];

export const DEMO_AUTHOR_ID = 'user_demo_writer';

export const withAuthor = (post) => ({ ...post, userId: DEMO_AUTHOR_ID });
