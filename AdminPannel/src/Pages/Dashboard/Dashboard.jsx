import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../../config/api'
import DashboardOne from '../../Components/DashboardOne/DashboardOne'
import DashboardTwo from '../../Components/DashboardTwo/DashboardTwo'
import DashboardThree from '../../Components/DashboardThree/DashboardThree'

const Dashboard = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    properties: [],
    enquiries: [],
    leads: [],
    sellRent: [],
    reviews: [],
    loading: true,
  })

  useEffect(() => {
    let mounted = true
    const loadAll = async () => {
      const results = await Promise.allSettled([
        fetch(`${API_ENDPOINTS.PROPERTIES}?limit=300`).then((r) => r.json()),
        fetch(API_ENDPOINTS.ENQUIRY).then((r) => r.json()),
        fetch(API_ENDPOINTS.LEADS).then((r) => r.json()),
        fetch(API_ENDPOINTS.SELL_RENT).then((r) => r.json()),
        fetch(API_ENDPOINTS.PROPERTY_REVIEWS).then((r) => r.json()),
      ])

      if (!mounted) return

      const pick = (res) =>
        res.status === 'fulfilled' && res.value && res.value.success && Array.isArray(res.value.data)
          ? res.value.data
          : []

      setData({
        properties: pick(results[0]),
        enquiries: pick(results[1]),
        leads: pick(results[2]),
        sellRent: pick(results[3]),
        reviews: pick(results[4]),
        loading: false,
      })
    }
    loadAll()
    return () => {
      mounted = false
    }
  }, [])

  const sellRequests = useMemo(
    () => data.sellRent.filter((x) => x.listingType === 'sell'),
    [data.sellRent]
  )
  const rentRequests = useMemo(
    () => data.sellRent.filter((x) => x.listingType === 'rent'),
    [data.sellRent]
  )

  const summary = useMemo(() => {
    const activeProps = data.properties.filter((p) => !p.isDraft && p.status === 'Active').length
    const draftProps = data.properties.filter((p) => p.isDraft || p.status === 'Draft' || p.status === 'Pending').length
    const featuredProps = data.properties.filter((p) => p.isFeatured).length
    const bestProps = data.properties.filter((p) => p.isBestProperty).length

    return {
      totalProperties: data.properties.length,
      totalEnquiries: data.enquiries.length + data.leads.length,
      totalSell: sellRequests.length,
      totalRent: rentRequests.length,
      activeProps,
      draftProps,
      featuredProps,
      bestProps,
    }
  }, [data, sellRequests.length, rentRequests.length])

  const handleQuickAction = (actionId) => {
    const routes = {
      add: '/properties/add',
      manage: '/properties',
      enquiries: '/enquiry',
      team: '/team',
    }
    if (routes[actionId]) navigate(routes[actionId])
  }

  return (
    <div>
      <DashboardOne
        summary={summary}
        onCardClick={(id) => {
          const map = {
            properties: '/properties',
            enquiries: '/enquiry',
            sell: '/sell',
            rent: '/rent',
          }
          if (map[id]) navigate(map[id])
        }}
      />
      <DashboardTwo
        enquiries={data.enquiries}
        leads={data.leads}
        summary={summary}
        onAddProperty={() => navigate('/properties/add')}
      />
      <DashboardThree
        enquiries={data.enquiries}
        properties={data.properties}
        onViewAllEnquiries={() => navigate('/enquiry')}
        onViewAllProperties={() => navigate('/properties')}
        onQuickAction={handleQuickAction}
        onSelectProperty={(p) => navigate(`/properties/add?id=${p.id}`)}
      />
    </div>
  )
}

export default Dashboard
