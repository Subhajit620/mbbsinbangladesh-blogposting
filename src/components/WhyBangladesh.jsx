import studentMain from "./Bangladeshstudent.jpg";
import studentInset from "./MBBSBangladeshstudent2.jpg";

function WhyBangladesh() {


  const points = [
    {
      icon: "🎓",
      title: "NMC & BMDC Approved",
      desc: "All colleges are approved by the National Medical Commission and Bangladesh Medical & Dental Council — ensuring global recognition."
    },

    {
      icon: "💰",
      title: "Affordable SAARC Quota",
      desc: "Fees starting from just 25–35 lakhs for the full 5-year MBBS course — significantly lower than private colleges in India."
    },

    {
      icon: "🌍",
      title: "Global Career Opportunities",
      desc: "Graduates are eligible for FMGE, USMLE, PLAB and can practice worldwide after clearing respective licensing exams."
    },

    {
      icon: "🏥",
      title: "English Medium Education",
      desc: "All teaching is in English. No IELTS/TOEFL required. Similar curriculum and disease patterns to India."
    }
  ];



  return (

    <section
      id="why-bd"

      className="
      py-20
      px-6

      bg-white
      "
    >


      <div className="
      max-w-7xl
      mx-auto

      grid

      lg:grid-cols-2

      gap-14

      items-center
      ">



        {/* IMAGE SECTION */}


        <div className="
        relative
        ">


          <img

            src={studentMain}

            alt="MBBS Bangladesh Students"

            className="
            w-full

            rounded-3xl

            shadow-xl

            object-cover

            h-[450px]
            "

          />



          <img

            src={studentInset}

            alt="MBBS Students"

            className="
            absolute
            hidden sm:block
            -bottom-10
            -right-5
            w-52
            h-52
            object-cover
            rounded-2xl
            border-4
            border-white
            shadow-xl
            "

          />





          {/* FLOAT BADGE */}


          <div className="
          absolute

          top-8

          left-8


          bg-white

          shadow-lg

          rounded-2xl

          px-6

          py-4

          text-center

          ">


            <h3 className="
            text-3xl

            font-bold

            text-emerald-600

            ">

              5000+

            </h3>


            <p className="
            text-gray-600

            text-sm

            ">

              Indian Students

            </p>


          </div>



        </div>







        {/* CONTENT SECTION */}



        <div>


          <span className="
          text-emerald-600

          font-semibold

          uppercase

          tracking-widest

          text-sm
          ">


            Why Bangladesh


          </span>





          <h2 className="
          mt-3

          text-4xl

          lg:text-5xl

          font-bold

          text-gray-900
          ">


            Why Study

            <span className="
            text-emerald-600
            ">

              MBBS

            </span>

            in Bangladesh?


          </h2>




          <div className="
          w-20

          h-1

          bg-emerald-500

          mt-5

          mb-6
          "/>





          <p className="
          text-gray-600

          leading-relaxed

          mb-8
          ">


            One of the cheapest and most reliable destinations for medical education abroad. With 60+ NMC-approved colleges and a high FMGE pass rate, Bangladesh is the top choice for Indian NEET-qualified students in 2026.


          </p>







          <div className="
          space-y-5
          ">



            {
              points.map((item)=>(


                <div

                key={item.title}

                className="
                flex

                gap-4

                p-4

                rounded-2xl

                hover:bg-emerald-50

                transition
                "

                >


                  <div className="
                  text-3xl
                  ">


                    {item.icon}


                  </div>




                  <div>


                    <h3 className="
                    font-bold

                    text-gray-900

                    ">

                      {item.title}

                    </h3>



                    <p className="
                    text-gray-600

                    text-sm

                    mt-1

                    leading-relaxed

                    ">

                      {item.desc}

                    </p>


                  </div>


                </div>


              ))
            }



          </div>



        </div>



      </div>


    </section>


  )

}


export default WhyBangladesh;