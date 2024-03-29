import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client, exploreProfiles } from "../api";

export default function Home() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      /* fetch profiles from Lens API */
      let response = await client.query({ query: exploreProfiles });
      /* loop over profiles, create properly formatted ipfs image links */
      let profileData = await Promise.all(
        response.data.exploreProfiles.items.map(async (profileInfo) => {
          let profile = { ...profileInfo };
          let picture = profile.picture;
          if (picture && picture.original && picture.original.url) {
            if (picture.original.url.startsWith("ipfs://")) {
              let result = picture.original.url.substring(7, picture.original.url.length);
              profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`;
            } else {
              profile.avatarUrl = picture.original.url;
            }
          }
          return profile;
        })
      );

      /* update the local state with the profiles array */
      setProfiles(profileData);
    } catch (err) {
      console.log({ err });
    }
  }

  return (
    <>
      <Head>
        <title>Web3</title>
        <meta name="description" content="Web3" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Home</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div>
              {profiles.map((profile) => (
                <div key={profile.id} className="w-2/3 shadow-md p-6 rounded-lg mb-8 flex flex-col items-center">
                  <img className="w-48" src={profile.avatarUrl || "https://picsum.photos/200"} />
                  <p className="text-xl text-center mt-6">{profile.name}</p>
                  <p className="text-base text-gray-400  text-center mt-2">{profile.bio}</p>
                  <Link href={`/profile/${profile.handle}`}>
                    <p className="cursor-pointer text-violet-600 text-lg font-medium text-center mt-2 mb-2">
                      {profile.handle}
                    </p>
                  </Link>
                  <p className="text-pink-600 text-sm font-medium text-center">
                    {profile.stats.totalFollowers} followers
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
