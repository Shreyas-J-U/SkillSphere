import axios from 'axios';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';

// In-memory cache to reduce API calls
const jobCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Log API key status on startup
console.log('🔑 RapidAPI Key Status:', RAPIDAPI_KEY ? '✅ Configured' : '❌ Not configured');
console.log('🌐 RapidAPI Host:', RAPIDAPI_HOST);

/**
 * Search for jobs using JSearch API
 * @param {Array<string>} skills - Array of skills to search for
 * @param {string} location - Job location (default: "Remote")
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} Job search results
 */
export const searchJobs = async (skills, location = 'Remote', page = 1, employmentType = 'all') => {
  try {
    console.log('📋 searchJobs called with skills:', skills);
    console.log('📍 Location:', location, '| Page:', page, '| Type:', employmentType);
    
    // Create cache key including employment type
    const cacheKey = `${skills.join(',')}_${location}_${page}_${employmentType}`;
    console.log('🔑 Cache key:', cacheKey);
    
    // Check cache first
    const cached = jobCache.get(cacheKey);
    const hasValidApiKey = RAPIDAPI_KEY && RAPIDAPI_KEY !== 'your_api_key_here';
    
    // Only use cache if it's not mock data OR if we don't have an API key
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      // If cached data is mock but we now have a real API key, skip cache
      if (cached.data.isMockData && hasValidApiKey) {
        console.log('⚠️ Skipping cached mock data because real API key is now available');
      } else {
        console.log('✅ Returning cached job results (isMockData:', cached.data.isMockData, ')');
        return cached.data;
      }
    } else {
      console.log('❌ No valid cache found');
    }

    // If no API key, return mock data for development
    console.log('🔍 Checking API key... RAPIDAPI_KEY exists:', !!RAPIDAPI_KEY);
    console.log('🔍 RAPIDAPI_KEY value:', RAPIDAPI_KEY ? `${RAPIDAPI_KEY.substring(0, 10)}...` : 'undefined');
    
    if (!hasValidApiKey) {
      console.log('⚠️ No valid RapidAPI key found, returning mock data');
      return getMockJobData(skills);
    }

    console.log('🚀 Fetching real jobs from JSearch API for skills:', skills.slice(0, 3).join(', '));

    // Build a more effective search query
    const primarySkill = skills[0];
    const query = `${primarySkill} developer`; 
    
    console.log('🔎 Constructed Query:', query);

    // Map our internal types to API types
    const typeMap = {
      'all': 'FULLTIME,PARTTIME,INTERN,CONTRACTOR',
      'FULLTIME': 'FULLTIME',
      'PARTTIME': 'PARTTIME',
      'INTERN': 'INTERN',
      'CONTRACTOR': 'CONTRACTOR'
    };

    const options = {
      method: 'GET',
      url: `https://${RAPIDAPI_HOST}/search`,
      params: {
        query: query,
        page: page.toString(),
        num_pages: '1', 
        remote_jobs_only: location.toLowerCase() === 'remote' ? 'true' : 'false',
        employment_types: typeMap[employmentType] || typeMap['all']
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    let response = await axios.request(options);
    
    console.log('✅ JSearch API Response Status:', response.status);
    console.log('📊 Jobs returned:', response.data.data?.length || 0);

    // FALLBACK: If no jobs found with "Skill developer", try just "Skill"
    if ((!response.data.data || response.data.data.length === 0) && page === 1) {
      console.log('⚠️ No jobs found with specific query. Trying broader fallback query:', primarySkill);
      
      options.params.query = primarySkill;
      // Remove employment types restriction for fallback to get ANYTHING
      delete options.params.employment_types;
      
      response = await axios.request(options);
      console.log('📊 Fallback Jobs returned:', response.data.data?.length || 0);
    }
    
    // Transform the response to our format
    const transformedData = {
      jobs: response.data.data?.map(job => ({
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city || job.job_state || job.job_country || 'Remote',
        description: job.job_description,
        employmentType: job.job_employment_type,
        datePosted: job.job_posted_at_datetime_utc,
        salaryMin: job.job_min_salary,
        salaryMax: job.job_max_salary,
        salaryCurrency: job.job_salary_currency,
        applyLink: job.job_apply_link,
        companyLogo: job.employer_logo,
        isRemote: job.job_is_remote,
        requiredSkills: job.job_required_skills || [],
        highlights: job.job_highlights
      })) || [],
      totalJobs: response.data.data?.length || 0,
      page: page
    };

    console.log('✅ Transformed jobs:', transformedData.totalJobs);

    // Cache the results
    jobCache.set(cacheKey, {
      data: transformedData,
      timestamp: Date.now()
    });

    return transformedData;
  } catch (error) {
    console.error('Error fetching jobs from JSearch API:', error.message);
    
    // Return mock data as fallback for all errors (403, 429, network issues, etc.)
    console.log('Falling back to mock data due to API error');
    return getMockJobData(skills);
  }
};

/**
 * Get mock job data for development/fallback
 */
const getMockJobData = (skills) => {
  const mockJobs = [
    {
      id: 'mock-1',
      title: `${skills[0] || 'Software'} Developer`,
      company: 'Tech Innovations Inc',
      location: 'Remote',
      description: `We're looking for a talented developer with expertise in ${skills.join(', ')}. Join our dynamic team and work on cutting-edge projects.`,
      employmentType: 'FULLTIME',
      datePosted: new Date().toISOString(),
      salaryMin: 60000,
      salaryMax: 100000,
      salaryCurrency: 'USD',
      applyLink: 'https://example.com/apply',
      companyLogo: 'https://via.placeholder.com/100',
      isRemote: true,
      requiredSkills: skills.slice(0, 3),
      highlights: {
        Qualifications: [`Experience with ${skills[0]}`, 'Strong problem-solving skills'],
        Responsibilities: ['Develop new features', 'Collaborate with team']
      }
    },
    {
      id: 'mock-2',
      title: `Senior ${skills[0] || 'Full Stack'} Engineer`,
      company: 'Digital Solutions Ltd',
      location: 'New York, NY',
      description: `Seeking an experienced engineer proficient in ${skills.slice(0, 2).join(' and ')}. Competitive salary and benefits.`,
      employmentType: 'FULLTIME',
      datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      salaryMin: 80000,
      salaryMax: 130000,
      salaryCurrency: 'USD',
      applyLink: 'https://example.com/apply',
      companyLogo: 'https://via.placeholder.com/100',
      isRemote: false,
      requiredSkills: skills.slice(0, 2),
      highlights: {
        Qualifications: ['5+ years experience', 'Bachelor\'s degree'],
        Responsibilities: ['Lead development projects', 'Mentor junior developers']
      }
    },
    {
      id: 'mock-3',
      title: `${skills[1] || 'Frontend'} Intern`,
      company: 'StartUp Ventures',
      location: 'Remote',
      description: `Internship opportunity for students interested in ${skills[1] || 'web development'}. Great learning experience!`,
      employmentType: 'INTERN',
      datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      salaryMin: 15,
      salaryMax: 25,
      salaryCurrency: 'USD',
      applyLink: 'https://example.com/apply',
      companyLogo: 'https://via.placeholder.com/100',
      isRemote: true,
      requiredSkills: [skills[1] || 'JavaScript'],
      highlights: {
        Qualifications: ['Currently pursuing degree', 'Passion for learning'],
        Responsibilities: ['Assist in development', 'Learn from senior team']
      }
    },
    {
      id: 'mock-4',
      title: `Part-Time ${skills[0] || 'Web'} Developer`,
      company: 'Flexible Tech Co',
      location: 'San Francisco, CA',
      description: `Looking for a part-time developer skilled in ${skills[0] || 'web technologies'}. Perfect for those seeking work-life balance!`,
      employmentType: 'PARTTIME',
      datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      salaryMin: 30,
      salaryMax: 50,
      salaryCurrency: 'USD',
      applyLink: 'https://example.com/apply',
      companyLogo: 'https://via.placeholder.com/100',
      isRemote: true,
      requiredSkills: [skills[0] || 'JavaScript', skills[1] || 'HTML'],
      highlights: {
        Qualifications: ['2+ years experience', 'Flexible schedule'],
        Responsibilities: ['Build features 20hrs/week', 'Attend weekly meetings']
      }
    },
    {
      id: 'mock-5',
      title: `Freelance ${skills[1] || 'Backend'} Contractor`,
      company: 'Global Consulting Group',
      location: 'Remote',
      description: `Contract position for ${skills[1] || 'backend'} specialist. 3-6 month project with potential for extension.`,
      employmentType: 'CONTRACTOR',
      datePosted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      salaryMin: 70,
      salaryMax: 120,
      salaryCurrency: 'USD',
      applyLink: 'https://example.com/apply',
      companyLogo: 'https://via.placeholder.com/100',
      isRemote: true,
      requiredSkills: skills.slice(0, 2),
      highlights: {
        Qualifications: ['3+ years experience', 'Portfolio required'],
        Responsibilities: ['API development', 'Database optimization']
      }
    },
    {
      id: 'mock-6',
      title: `Junior ${skills[0] || 'Software'} Engineer`,
      company: 'Growth Startup Inc',
      location: 'Austin, TX',
      description: `Entry-level position for recent graduates with ${skills[0] || 'programming'} skills. Mentorship provided!`,
      employmentType: 'FULLTIME',
      datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      salaryMin: 50000,
      salaryMax: 70000,
      salaryCurrency: 'USD',
      applyLink: 'https://example.com/apply',
      companyLogo: 'https://via.placeholder.com/100',
      isRemote: false,
      requiredSkills: [skills[0] || 'JavaScript'],
      highlights: {
        Qualifications: ['Bachelor\'s degree or bootcamp', 'Eager to learn'],
        Responsibilities: ['Write clean code', 'Participate in code reviews']
      }
    }
  ];

  return {
    jobs: mockJobs,
    totalJobs: mockJobs.length,
    page: 1,
    isMockData: true
  };
};

/**
 * Clear the job cache (useful for development/testing)
 */
export const clearCache = () => {
  jobCache.clear();
  console.log('🗑️ Job cache cleared');
};

export default { searchJobs, clearCache };
